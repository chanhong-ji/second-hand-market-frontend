/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserFragment
// ====================================================

export interface UserFragment_zone {
  __typename: "Zone";
  id: number;
  name: string;
}

export interface UserFragment {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
  followingCount: number;
  postsCount: number;
  zone: UserFragment_zone | null;
  isMe: boolean;
  isFollowing: boolean;
  createdAt: string;
  updatedAt: string;
}
