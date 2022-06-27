/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: updateRoom
// ====================================================

export interface updateRoom_updateRoom_message {
  __typename: "Message";
  id: number;
  payload: string;
  userId: number;
  read: boolean;
  createdAt: string;
}

export interface updateRoom_updateRoom {
  __typename: "UpdateResult";
  read: boolean | null;
  message: updateRoom_updateRoom_message;
}

export interface updateRoom {
  updateRoom: updateRoom_updateRoom;
}

export interface updateRoomVariables {
  roomId: number;
}
