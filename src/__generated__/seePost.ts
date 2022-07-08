/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seePost
// ====================================================

export interface seePost_seePost_user {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
}

export interface seePost_seePost_category {
  __typename: "Category";
  id: number;
  name: string;
}

export interface seePost_seePost {
  __typename: "Post";
  id: number;
  title: string;
  caption: string;
  dealt: boolean;
  price: number;
  user: seePost_seePost_user;
  photos: string[];
  category: seePost_seePost_category;
  zoneName: string;
  isMine: boolean;
  isInterest: boolean;
  interestsCount: number;
  hasRoom: number;
  roomCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface seePost {
  seePost: seePost_seePost | null;
}

export interface seePostVariables {
  id: number;
}
