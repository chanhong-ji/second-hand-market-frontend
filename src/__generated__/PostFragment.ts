/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PostFragment
// ====================================================

export interface PostFragment_user {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
}

export interface PostFragment_zone {
  __typename: "Zone";
  id: number;
  name: string;
}

export interface PostFragment_category {
  __typename: "Category";
  id: number;
  name: string;
}

export interface PostFragment {
  __typename: "Post";
  id: number;
  title: string;
  caption: string;
  dealt: boolean;
  user: PostFragment_user;
  photos: string[];
  zone: PostFragment_zone;
  category: PostFragment_category;
  isMine: boolean;
  isInterest: boolean;
  interestsCount: number;
  createdAt: string;
  updatedAt: string;
}
