/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePosts
// ====================================================

export interface seePosts_seePosts_user {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
}

export interface seePosts_seePosts_zone {
  __typename: "Zone";
  id: number;
  name: string;
}

export interface seePosts_seePosts_category {
  __typename: "Category";
  id: number;
  name: string;
}

export interface seePosts_seePosts {
  __typename: "Post";
  id: number;
  title: string;
  caption: string;
  dealt: boolean;
  price: number;
  user: seePosts_seePosts_user;
  photos: string[];
  zone: seePosts_seePosts_zone;
  category: seePosts_seePosts_category;
  isMine: boolean;
  isInterest: boolean;
  interestsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface seePosts {
  seePosts: (seePosts_seePosts | null)[] | null;
}

export interface seePostsVariables {
  zoneId: number;
  categoryId?: number | null;
  page?: number | null;
}
