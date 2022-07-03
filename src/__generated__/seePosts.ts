/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePosts
// ====================================================

export interface seePosts_seePosts_posts_user {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
}

export interface seePosts_seePosts_posts_zone {
  __typename: "Zone";
  id: number;
  name: string;
}

export interface seePosts_seePosts_posts_category {
  __typename: "Category";
  id: number;
  name: string;
}

export interface seePosts_seePosts_posts {
  __typename: "Post";
  id: number;
  title: string;
  caption: string;
  dealt: boolean;
  price: number;
  user: seePosts_seePosts_posts_user;
  photos: string[];
  zone: seePosts_seePosts_posts_zone;
  category: seePosts_seePosts_posts_category;
  isMine: boolean;
  isInterest: boolean;
  interestsCount: number;
  hasRoom: number;
  roomCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface seePosts_seePosts {
  __typename: "SeePostsResult";
  posts: (seePosts_seePosts_posts | null)[];
  totalResults: number;
}

export interface seePosts {
  seePosts: seePosts_seePosts;
}

export interface seePostsVariables {
  zoneFirst: number;
  zoneSecond: number;
  categoryName?: string | null;
  page?: number | null;
}
