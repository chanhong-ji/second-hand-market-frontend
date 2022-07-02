import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    name
    avatar
    followerCount
    followingCount
    postsCount
    dealtCount
    zone {
      id
      name
    }
    isMe
    isFollowing
    interestCount
    createdAt
    updatedAt
  }
`;

export const ROOM_FRAGMENT = gql`
  fragment RoomFragment on Room {
    id
    postId
    post {
      id
      title
      price
      dealt
    }
    users {
      id
      name
      avatar
    }
  }
`;

export const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
    id
    title
    caption
    dealt
    price
    user {
      id
      name
      avatar
    }
    photos
    zone {
      id
      name
    }
    category {
      id
      name
    }
    isMine
    isInterest
    interestsCount
    hasRoom
    createdAt
    updatedAt
  }
`;

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    payload
    userId
    read
    createdAt
  }
`;
