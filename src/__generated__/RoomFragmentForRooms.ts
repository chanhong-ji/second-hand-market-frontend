/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RoomFragmentForRooms
// ====================================================

export interface RoomFragmentForRooms_users {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
}

export interface RoomFragmentForRooms {
  __typename: "Room";
  id: number;
  postId: number;
  createdAt: string;
  updatedAt: string;
  unreadTotal: number;
  users: (RoomFragmentForRooms_users | null)[];
}
