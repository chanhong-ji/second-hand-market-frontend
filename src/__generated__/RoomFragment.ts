/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RoomFragment
// ====================================================

export interface RoomFragment_post {
  __typename: "Post";
  id: number;
  title: string;
  price: number;
  dealt: boolean;
}

export interface RoomFragment_users {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
}

export interface RoomFragment {
  __typename: "Room";
  id: number;
  postId: number;
  post: RoomFragment_post;
  users: (RoomFragment_users | null)[];
}
