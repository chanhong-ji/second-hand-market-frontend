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
  id: number | null;
}

export interface editPost {
  editPost: editPost_editPost;
}

export interface editPostVariables {
  id: number;
  title?: string | null;
  price?: number | null;
  caption?: string | null;
  categoryName?: string | null;
}
