/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createPost
// ====================================================

export interface createPost_createPost {
  __typename: "MutationResult";
  ok: boolean;
  error: string | null;
}

export interface createPost {
  createPost: createPost_createPost;
}

export interface createPostVariables {
  title: string;
  caption: string;
  photos: any[];
  categoryId: number;
}