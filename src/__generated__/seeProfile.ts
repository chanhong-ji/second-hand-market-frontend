/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeProfile
// ====================================================

export interface seeProfile_seeProfile_zone {
  __typename: "Zone";
  id: number;
  name: string;
}

export interface seeProfile_seeProfile_posts_zone {
  __typename: "Zone";
  id: number;
  name: string;
}

export interface seeProfile_seeProfile_posts {
  __typename: "Post";
  id: number;
  title: string;
  photos: string[];
  dealt: boolean;
  interestsCount: number;
  zone: seeProfile_seeProfile_posts_zone;
}

export interface seeProfile_seeProfile {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
  followingCount: number;
  postsCount: number;
  zone: seeProfile_seeProfile_zone | null;
  isMe: boolean;
  isFollowing: boolean;
  createdAt: string;
  updatedAt: string;
  posts: (seeProfile_seeProfile_posts | null)[] | null;
}

export interface seeProfile {
  seeProfile: seeProfile_seeProfile | null;
}

export interface seeProfileVariables {
  id: number;
  offset?: number | null;
}
