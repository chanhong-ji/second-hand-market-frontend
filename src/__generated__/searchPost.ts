/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchPost
// ====================================================

export interface searchPost_searchPost_posts_user {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
}

export interface searchPost_searchPost_posts_zone {
  __typename: "Zone";
  id: number;
  name: string;
}

export interface searchPost_searchPost_posts_category {
  __typename: "Category";
  id: number;
  name: string;
}

export interface searchPost_searchPost_posts {
  __typename: "Post";
  id: number;
  title: string;
  caption: string;
  dealt: boolean;
  price: number;
  user: searchPost_searchPost_posts_user;
  photos: string[];
  zone: searchPost_searchPost_posts_zone;
  category: searchPost_searchPost_posts_category;
  isMine: boolean;
  isInterest: boolean;
  interestsCount: number;
  hasRoom: number;
  createdAt: string;
  updatedAt: string;
}

export interface searchPost_searchPost {
  __typename: "SearchPostResult";
  posts: (searchPost_searchPost_posts | null)[];
  totalResults: number;
}

export interface searchPost {
  searchPost: searchPost_searchPost;
}

export interface searchPostVariables {
  keyword: string;
  zoneFirst: number;
  zoneSecond: number;
  page?: number | null;
}
