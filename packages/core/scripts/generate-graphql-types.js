/**
 * Generates TypeScript types for `src/graphql/queries` from GitHub's published schema:
 * one file per query, plus a `common.ts` for the types their variables name.
 *
 * Pass `--check` to fail on drift instead of writing.
 */
import fs from "node:fs/promises";
import path from "node:path";

import { codegen } from "@graphql-codegen/core";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import * as typescriptOperationsPlugin from "@graphql-codegen/typescript-operations";
import { schema as githubSchema } from "@octokit/graphql-schema";
import {
  GraphQLSchema,
  Kind,
  buildSchema,
  getNamedType,
  isSpecifiedScalarType,
  parse,
  print,
  printSchema,
  typeFromAST,
  visit,
} from "graphql";
import { format, resolveConfig } from "prettier";

/**
 * @typedef {Parameters<typeof codegen>[0]} CodegenOptions
 * @typedef {CodegenOptions["pluginMap"][string]} CodegenPlugin
 * @typedef {import("@graphql-codegen/typescript").TypeScriptPluginConfig} TypeScriptPluginConfig
 * @typedef {import("@graphql-codegen/typescript-operations").TypeScriptDocumentsPluginConfig} TypeScriptDocumentsPluginConfig
 * @typedef {import("graphql").ASTNode} ASTNode
 * @typedef {import("graphql").FragmentDefinitionNode} FragmentDefinitionNode
 * @typedef {import("graphql").GraphQLNamedType} GraphQLNamedType
 * @typedef {import("graphql").OperationDefinitionNode} OperationDefinitionNode
 * @typedef {Map<string, FragmentDefinitionNode>} FragmentMap Fragment definitions by name.
 */

const PACKAGE_ROOT = path.join(import.meta.dirname, "..");
const QUERIES_DIR = path.join(PACKAGE_ROOT, "src/graphql/queries");
const OUT_DIR = path.join(PACKAGE_ROOT, "src/graphql/generated");
const COMMON_FILE = path.join(OUT_DIR, "common.ts");
// `typescript-operations` resolves this against the working directory
const COMMON_IMPORT_PATH = path.relative(
  process.cwd(),
  COMMON_FILE.replace(/\.ts$/, ".js"),
);

/**
 * @param {string} file Absolute path.
 * @returns {string} The same path relative to the package, for log messages.
 */
const pathRelativeFromRoot = (file) => path.relative(PACKAGE_ROOT, file);

// CI mode: regenerate in memory, fail on any difference
const checkOnly = process.argv.includes("--check");

/** @type {TypeScriptPluginConfig & TypeScriptDocumentsPluginConfig} */
const config = {
  emitLegacyCommonJSImports: false,
  enumsAsTypes: true,
  skipTypename: true,
  useTypeImports: true,
  // enums and input types come from the common file, imported only where used
  importSchemaTypesFrom: COMMON_IMPORT_PATH,
  scalars: { DateTime: "string" },
};

// GitHub's SDL declares a few fields twice, which trips SDL validation
const schemaAst = buildSchema(githubSchema.idl, { assumeValidSDL: true });
// printed once: every query output reuses it
const schemaDocument = parse(printSchema(schemaAst));

// a missing folder is a broken checkout, not an empty query set: generating from it would
// delete every existing output
const queryDir = await fs.readdir(QUERIES_DIR).catch(() => {
  console.error(`No queries in ${pathRelativeFromRoot(QUERIES_DIR)}`);
  process.exit(1);
});
const queryFiles = queryDir.filter((file) => file.endsWith(".graphql")).sort();

const documents = await Promise.all(
  queryFiles.map(async (file) => {
    const location = path.join(QUERIES_DIR, file);
    const output = path.join(OUT_DIR, `${path.basename(file, ".graphql")}.ts`);
    const document = parse(await fs.readFile(location, "utf8"));
    return { location, output, document };
  }),
);

/**
 * Every fragment a node spreads, directly or through another fragment.
 *
 * @param {ASTNode} node Operation or fragment definition to walk.
 * @param {FragmentMap} fragments Fragments defined in the same file.
 * @param {FragmentMap} found Fragments collected so far.
 * @returns {FragmentMap} The fragment definitions the node needs.
 */
const spreadFragments = (node, fragments, found = new Map()) => {
  visit(node, {
    FragmentSpread(spread) {
      const name = spread.name.value;
      if (found.has(name)) {
        return;
      }
      const fragment = fragments.get(name);
      if (!fragment) {
        throw new Error(`No definition found for fragment "${name}"`);
      }
      found.set(name, fragment);
      spreadFragments(fragment, fragments, found);
    },
  });
  return found;
};

/**
 * @param {string} value Word to capitalize.
 * @returns {string} The capitalized word.
 */
const pascalCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);

/**
 * The names `typescript-operations` gives an operation's types.
 *
 * @param {OperationDefinitionNode} operation Operation definition.
 * @returns {{ documentName: string; resultType: string; variablesType: string }} Names to reference in the emitted document.
 */
const operationNames = (operation) => {
  if (!operation.name) {
    throw new Error("Every query needs a name to generate types from");
  }
  const name = pascalCase(operation.name.value);
  // `typescript-operations` appends the operation type unconditionally
  const resultType = `${name}${pascalCase(operation.operation)}`;
  return {
    documentName: `${name}Document`,
    resultType,
    variablesType: `${resultType}Variables`,
  };
};

/**
 * Emits one typed document per operation, beside its types.
 *
 * @type {CodegenPlugin['plugin']}
 */
const documentsPlugin = (_schema, files) => {
  // `document` is optional on codegen's file type; ours are always parsed
  const definitions = files.flatMap((file) => file.document?.definitions ?? []);
  const { FRAGMENT_DEFINITION, OPERATION_DEFINITION } = Kind;

  const fragments = new Map(
    definitions
      .filter((definition) => definition.kind === FRAGMENT_DEFINITION)
      .map((definition) => [definition.name.value, definition]),
  );

  const operations = definitions
    .filter((definition) => definition.kind === OPERATION_DEFINITION)
    .map((operation) => {
      const { documentName, resultType, variablesType } =
        operationNames(operation);
      const text = [
        print(operation),
        ...[...spreadFragments(operation, fragments).values()].map(print),
      ].join("\n");
      return `export const ${documentName} = graphqlDocument<${resultType}, ${variablesType}>(\`\n${text}\`);`;
    });

  return {
    prepend: [`import { graphqlDocument } from "../graphqlDocument.js";`],
    content: operations.join("\n\n"),
  };
};

// only the types the queries name in their variables; an unknown name yields undefined,
// which codegen reports later against the query
/** @type {Set<GraphQLNamedType>} */
const commonTypes = new Set();
for (const { document } of documents) {
  visit(document, {
    VariableDefinition({ type }) {
      // `getNamedType` strips the `[…]!` wrappers the variable declares
      const named = getNamedType(typeFromAST(schemaAst, type));
      if (named && !isSpecifiedScalarType(named)) {
        commonTypes.add(named);
      }
    },
  });
}

// emitted for the fragment masking we don't generate, with no config to leave it out
const INCREMENTAL_TYPE =
  /^\/\*\* Internal type\. DO NOT USE DIRECTLY\. \*\/\nexport type Incremental<T> = [^\n]*\n/m;

const BANNER = `// Generated file — see .github/CONTRIBUTING.md\n\n`;

/** @type {Array<Omit<CodegenOptions, "config">>} */
const outputs = documents.map((file) => ({
  filename: file.output,
  schema: schemaDocument,
  schemaAst,
  documents: [file],
  plugins: [{ "typescript-operations": {} }, { documents: {} }],
  pluginMap: {
    "typescript-operations": typescriptOperationsPlugin,
    documents: { plugin: documentsPlugin },
  },
}));

// queries with only built-in scalar variables need no common file
if (commonTypes.size) {
  const commonSchema = new GraphQLSchema({ types: [...commonTypes] });
  outputs.push({
    filename: COMMON_FILE,
    schema: parse(printSchema(commonSchema)),
    schemaAst: commonSchema,
    documents: [],
    plugins: [{ typescript: {} }],
    pluginMap: { typescript: typescriptPlugin },
  });
}

const prettierConfig = await resolveConfig(COMMON_FILE);
const generated = await Promise.all(
  outputs.map(async ({ filename, ...options }) => {
    const content = await codegen({ filename, config, ...options });
    return {
      filename,
      content: await format(BANNER + content.replace(INCREMENTAL_TYPE, ""), {
        ...prettierConfig,
        parser: "typescript",
      }),
    };
  }),
);

const queryCount = `${documents.length} ${documents.length === 1 ? "query" : "queries"}`;

// a deleted query leaves its generated file behind; anything else in the folder is not ours
const expected = new Set(generated.map(({ filename }) => filename));
const stale = (await fs.readdir(OUT_DIR).catch(() => []))
  .filter((file) => file.endsWith(".ts"))
  .map((file) => path.join(OUT_DIR, file))
  .filter((file) => !expected.has(file));

if (checkOnly) {
  const outdated = stale.map(pathRelativeFromRoot);
  for (const { filename, content } of generated) {
    const current = await fs.readFile(filename, "utf8").catch(() => null);
    if (current !== content) {
      outdated.push(pathRelativeFromRoot(filename));
    }
  }

  if (outdated.length > 0) {
    const files = outdated.map((file) => `  ${file}`).join("\n");
    const message = `GraphQL types are out of date:\n${files}\n\nRun \`pnpm --filter ./packages/core/ run generate-graphql-types\`.`;
    console.error(message);
    process.exit(1);
  }

  const message = `GraphQL types are up to date (${queryCount})`;
  console.log(message);
} else {
  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const { filename, content } of generated) {
    await fs.writeFile(filename, content);
  }

  for (const file of stale) {
    await fs.rm(file);
    const removed = `Removed ${pathRelativeFromRoot(file)} — no query generates it`;
    console.log(removed);
  }

  const outDir = pathRelativeFromRoot(OUT_DIR);
  const message = `Generated ${generated.length} files in ${outDir} from ${queryCount}`;
  console.log(message);
}
