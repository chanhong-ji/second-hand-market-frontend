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
