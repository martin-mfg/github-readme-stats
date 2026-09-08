// Generated file — see .github/CONTRIBUTING.md

/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
import { graphqlDocument } from "../graphqlDocument.js";
export type RepoInfoFragment = {
  name: string;
  nameWithOwner: string;
  isPrivate: boolean;
  isArchived: boolean;
  isTemplate: boolean;
  stargazerCount: number;
  description: string | null;
  forkCount: number;
  primaryLanguage: { color: string | null; id: string; name: string } | null;
};

export type GetRepoQueryVariables = Exact<{
  login: string;
  repo: string;
}>;

export type GetRepoQuery = {
  user: {
    repository: {
      name: string;
      nameWithOwner: string;
      isPrivate: boolean;
      isArchived: boolean;
      isTemplate: boolean;
      stargazerCount: number;
      description: string | null;
      forkCount: number;
      primaryLanguage: {
        color: string | null;
        id: string;
        name: string;
      } | null;
    } | null;
  } | null;
  organization: {
    repository: {
      name: string;
      nameWithOwner: string;
      isPrivate: boolean;
      isArchived: boolean;
      isTemplate: boolean;
      stargazerCount: number;
      description: string | null;
      forkCount: number;
      primaryLanguage: {
        color: string | null;
        id: string;
        name: string;
      } | null;
    } | null;
  } | null;
};

export const GetRepoDocument = graphqlDocument<
  GetRepoQuery,
  GetRepoQueryVariables
>(`
query getRepo($login: String!, $repo: String!) {
  user(login: $login) {
    repository(name: $repo) {
      ...RepoInfo
    }
  }
  organization(login: $login) {
    repository(name: $repo) {
      ...RepoInfo
    }
  }
}
fragment RepoInfo on Repository {
  name
  nameWithOwner
  isPrivate
  isArchived
  isTemplate
  stargazerCount
  description
  primaryLanguage {
    color
    id
    name
  }
  forkCount
}`);
