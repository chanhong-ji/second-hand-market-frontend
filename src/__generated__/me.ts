/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: me
// ====================================================

export interface me_me_zone {
  __typename: "Zone";
  name: string;
}

export interface me_me {
  __typename: "User";
  id: number;
  name: string;
  phone: number;
  avatar: string | null;
  followerCount: number;
  zoneId: string;
  zoneFirst: number | null;
  zoneSecond: number | null;
  zone: me_me_zone;
}

export interface me {
  me: me_me | null;
}
