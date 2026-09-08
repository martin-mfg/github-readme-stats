// Generated file — see .github/CONTRIBUTING.md

/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
import { graphqlDocument } from "../graphqlDocument.js";
export type GistFileInfoFragment = {
  name: string | null;
  size: number | null;
  language: { name: string } | null;
};

export type GistInfoQueryVariables = Exact<{
  gistName: string;
}>;

export type GistInfoQuery = {
  viewer: {
    gist: {
      description: string | null;
      stargazerCount: number;
      owner: { login: string } | { login: string } | null;
      forks: { totalCount: number };
      files: Array<{
        name: string | null;
        size: number | null;
        language: { name: string } | null;
      } | null> | null;
    } | null;
  };
};

export const GistInfoDocument = graphqlDocument<
  GistInfoQuery,
  GistInfoQueryVariables
>(`
query gistInfo($gistName: String!) {
  viewer {
    gist(name: $gistName) {
      description
      owner {
        login
      }
      stargazerCount
      forks {
        totalCount
      }
      files {
        ...GistFileInfo
      }
    }
  }
}
fragment GistFileInfo on GistFile {
  name
  language {
    name
  }
  size
}`);
