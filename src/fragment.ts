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
    zoneName
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
    category {
      id
      name
    }
    zoneName
    isMine
    isInterest
    interestsCount
    hasRoom
    roomCount
    createdAt
    updatedAt
  }
`;

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    payload
    userId
    roomId
    read
    createdAt
  }
`;

export const POST_FRAGMENT_FOR_BANNER = gql`
  fragment PostFragmentForBanner on Post {
    id
    title
    photos
    dealt
    price
    interestsCount
    roomCount
    isInterest
    zoneName
  }
`;

export const ROOM_FRAGMENT_FOR_ROOMS = gql`
  fragment RoomFragmentForRooms on Room {
    id
    postId
    createdAt
    updatedAt
    unreadTotal
    users {
      id
      name
      avatar
    }
  }
`;
