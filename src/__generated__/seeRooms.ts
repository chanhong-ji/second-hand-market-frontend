/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeRooms
// ====================================================

export interface seeRooms_seeRooms_users {
  __typename: "User";
  id: number;
  name: string;
  avatar: string | null;
}

export interface seeRooms_seeRooms {
  __typename: "Room";
  id: number;
  postId: number;
  createdAt: string;
  updatedAt: string;
  unreadTotal: number;
  users: (seeRooms_seeRooms_users | null)[];
}

export interface seeRooms {
  seeRooms: (seeRooms_seeRooms | null)[];
}

export interface seeRoomsVariables {
  userId: number;
  offset?: number | null;
}
