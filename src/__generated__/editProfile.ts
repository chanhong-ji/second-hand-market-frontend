/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editProfile
// ====================================================

export interface editProfile_editProfile {
  __typename: "MutationResult";
  ok: boolean;
  error: string | null;
}

export interface editProfile {
  editProfile: editProfile_editProfile;
}

export interface editProfileVariables {
  name?: string | null;
  password?: string | null;
  avatar?: any | null;
}
