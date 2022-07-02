/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeInterests
// ====================================================

export interface seeInterests_seeInterests_post {
  __typename: "Post";
  id: number;
  title: string;
  price: number;
  dealt: boolean;
  photos: string[];
  isInterest: boolean;
}

export interface seeInterests_seeInterests {
  __typename: "Interest";
  id: number;
  post: seeInterests_seeInterests_post;
}

export interface seeInterests {
  seeInterests: (seeInterests_seeInterests | null)[];
}

export interface seeInterestsVariables {
  offset?: number | null;
}
