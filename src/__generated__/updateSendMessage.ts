/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: updateSendMessage
// ====================================================

export interface updateSendMessage_updateSendMessage {
  __typename: "Message";
  id: number;
  payload: string;
  userId: number;
  read: boolean;
  createdAt: string;
}

export interface updateSendMessage {
  updateSendMessage: updateSendMessage_updateSendMessage;
}

export interface updateSendMessageVariables {
  roomId: number;
}
