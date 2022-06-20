/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeFollowing
// ====================================================

export interface seeFollowing_seeFollowing {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
  zoneId: string;
  isFollowing: boolean;
}

export interface seeFollowing {
  seeFollowing: (seeFollowing_seeFollowing | null)[] | null;
}

export interface seeFollowingVariables {
  userId: number;
  offset?: number | null;
}
