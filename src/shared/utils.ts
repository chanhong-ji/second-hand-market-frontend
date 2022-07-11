import { ApolloCache, gql } from '@apollo/client';

export const getFormatValue = (value: number) => {
  const formatValue = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
  return formatValue;
};

export const getZoneId = (first: string, second: string): number => {
  const secondZoneCode = second.padStart(2, '0');
  return +(first + secondZoneCode);
};

export const onToggleInterestUpdate = (
  cache: ApolloCache<any>,
  result: any,
  meDataId: number | undefined
) => {
  if (!meDataId) return;

  const {
    toggleInterest: { ok, id },
  } = result.data;
  if (!ok) return;

  cache.modify({
    id: `Post:${id}`,
    fields: {
      isInterest(prev) {
        return !prev;
      },
      interestsCount(prev, { readField }) {
        return readField('isInterest') ? prev - 1 : prev + 1;
      },
    },
  });

  const curPost: any = cache.readFragment({
    id: `Post:${id}`,
    fragment: gql`
      fragment interestFrag on Post {
        isInterest
      }
    `,
  });

  cache.modify({
    id: `User:${meDataId}`,
    fields: {
      interestCount: (prev) => (curPost.isInterest ? prev + 1 : prev - 1),
    },
  });
};

export const onToggleFollowUpdate = (
  cache: ApolloCache<any>,
  result: any,
  meDataId: number | undefined | null
) => {
  if (!meDataId) return;

  const {
    toggleFollow: { ok, error, id },
  } = result.data;
  if (!ok) return alert(error);

  cache.modify({
    id: `User:${id}`,
    fields: {
      isFollowing(prev) {
        return !prev;
      },
      followerCount(prev, { readField }) {
        const isFollowing = readField('isFollowing');
        return isFollowing ? prev - 1 : prev + 1;
      },
    },
  });

  const isFollowing: any = cache.readFragment({
    id: `User:${id}`,
    fragment: gql`
      fragment Frag on User {
        isFollowing
      }
    `,
  });

  cache.modify({
    id: `User:${meDataId}`,
    fields: {
      followingCount(prev) {
        return isFollowing.isFollowing ? prev + 1 : prev - 1;
      },
    },
  });
};
