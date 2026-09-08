// Generated file — see .github/CONTRIBUTING.md

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** An ISO-8601 encoded UTC date string. */
  DateTime: { input: string; output: string };
};

/** The affiliation of a user to a repository */
export type RepositoryAffiliation =
  /** Repositories that the user has been added to as a collaborator. */
  | "COLLABORATOR"
  /**
   * Repositories that the user has access to through being a member of an
   * organization. This includes every repository on every team that the user is on.
   */
  | "ORGANIZATION_MEMBER"
  /** Repositories that are owned by the authenticated user. */
  | "OWNER";
