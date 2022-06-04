import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    name
    avatar
    followingCount
    postsCount
    zone {
      id
      name
    }
    isMe
    isFollowing
    createdAt
    updatedAt
  }
`;

export const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
    id
    title
    caption
    dealt
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
    createdAt
    updatedAt
  }
`;
