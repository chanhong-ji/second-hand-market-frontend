/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeRoom
// ====================================================

export interface seeRoom_seeRoom_post {
  __typename: "Post";
  id: number;
  title: string;
  price: number;
  dealt: boolean;
}

export interface seeRoom_seeRoom_users {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
}

export interface seeRoom_seeRoom_messages {
  __typename: "Message";
  id: number;
  payload: string;
  userId: number;
  read: boolean;
  createdAt: string;
}

export interface seeRoom_seeRoom {
  __typename: "Room";
  id: number;
  postId: number;
  post: seeRoom_seeRoom_post;
  users: (seeRoom_seeRoom_users | null)[];
  messages: (seeRoom_seeRoom_messages | null)[];
}

export interface seeRoom {
  seeRoom: seeRoom_seeRoom | null;
}

export interface seeRoomVariables {
  roomId: number;
  offset?: number | null;
}
