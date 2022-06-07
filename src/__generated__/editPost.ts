/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editPost
// ====================================================

export interface editPost_editPost {
  __typename: "MutationResult";
  ok: boolean;
  error: string | null;
}

export interface editPost {
  editPost: editPost_editPost;
}

export interface editPostVariables {
  id: number;
  title?: string | null;
  caption?: string | null;
  categoryId?: number | null;
}
