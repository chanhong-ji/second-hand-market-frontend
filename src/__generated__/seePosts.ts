/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePosts
// ====================================================

export interface seePosts_seePosts_posts {
  __typename: "Post";
  id: number;
  title: string;
  photos: string[];
  dealt: boolean;
  price: number;
  interestsCount: number;
  roomCount: number;
  isInterest: boolean;
  zoneName: string;
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
