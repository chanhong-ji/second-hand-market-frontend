/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserFragment
// ====================================================

export interface UserFragment {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
  followerCount: number;
  followingCount: number;
  postsCount: number;
  dealtCount: number;
  zoneName: string;
  isMe: boolean;
  isFollowing: boolean;
  interestCount: number;
  createdAt: string;
  updatedAt: string;
}
