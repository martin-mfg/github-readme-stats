import type { RepositoryAffiliation } from "../graphql/generated/common.js";

/**
 * Valid owner affiliations for GitHub API queries.
 */
const OWNER_AFFILIATIONS: Array<RepositoryAffiliation> = [
  "OWNER",
  "COLLABORATOR",
  "ORGANIZATION_MEMBER",
];

export { OWNER_AFFILIATIONS };
