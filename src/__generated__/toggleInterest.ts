/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: toggleInterest
// ====================================================

export interface toggleInterest_toggleInterest {
  __typename: "MutationResult";
  ok: boolean;
  error: string | null;
  id: number | null;
}

export interface toggleInterest {
  toggleInterest: toggleInterest_toggleInterest;
}

export interface toggleInterestVariables {
  id: number;
}
