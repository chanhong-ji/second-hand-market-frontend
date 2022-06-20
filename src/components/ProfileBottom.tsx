import { gql, useApolloClient, useQuery } from '@apollo/client';
import { motion, useViewportScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { seeFollowing } from '../__generated__/seeFollowing';
import { seeProfile_seeProfile } from '../__generated__/seeProfile';
import FollowingBanner from './FollowingBanner';
import ItemBanner from './ItemBanner';

const Column = styled.div``;
const Indicator = styled(motion.div)``;
const NavBar = styled.div`
  border-bottom: 1px solid ${(p) => p.theme.color.border};
  display: flex;
  align-items: center;
  ${Column} {
    padding: 10px 20px;
    position: relative;
    ${Indicator} {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      border-radius: 5px;
      width: 100%;
      background-color: tomato;
    }
  }
`;
const Bottom = styled.article<{ index: number }>`
  width: 100%;
  padding: 50px 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
  grid-template-columns: ${(p) => (p.index === 0 ? '1fr 1fr 1fr' : '1fr 1fr')};
`;

const SEE_FOLLOWING_QUERY = gql`
  query seeFollowing($userId: Int!, $offset: Int) {
    seeFollowing(userId: $userId, offset: $offset) {
      id
      name
      avatar
      zoneId
      isFollowing
    }
  }
`;

function ProfileBottom(props: seeProfile_seeProfile) {
  const [index, setIndex] = useState(0);
  const { pathname } = useLocation();
  const { scrollYProgress } = useViewportScroll();
  const {
    data: followingData,
    refetch,
    fetchMore,
  } = useQuery<seeFollowing>(SEE_FOLLOWING_QUERY, {
    variables: { userId: props.id },
  });
  const refetching: any = useApolloClient().cache.readFragment({
    id: `User:${props.id}`,
    fragment: gql`
      fragment UserFragment on User {
        followingCount
      }
    `,
  });

  useEffect(() => {
    setIndex(0);
  }, [pathname.split('/').pop()]);

  useEffect(() => {
    if (refetching?.followingCount) {
      refetch({ variable: { userId: props.id } });
    }
  }, [refetching]);

  useEffect(() => {
    scrollYProgress.onChange((value) => {
      if (value > 0.95 && followingData?.seeFollowing) {
        scrollYProgress.clearListeners();
        fetchMore({
          variables: {
            userId: props.id,
            offset: followingData.seeFollowing.length,
          },
        });
      }
    });
  }, [props]);

  return (
    <>
      <NavBar>
        <Column id='0' onClick={(e) => setIndex(+e.currentTarget.id)}>
          판매물품 ({props.postsCount})
          {index === 0 && <Indicator layoutId='indexIndicator' />}
        </Column>
        {props.isMe && (
          <Column id='1' onClick={(e) => setIndex(+e.currentTarget.id)}>
            팔로잉 ({props.followingCount ?? ''})
            {index === 1 && <Indicator layoutId='indexIndicator' />}
          </Column>
        )}
      </NavBar>
      <Bottom index={index}>
        {index === 0
          ? props.posts?.map((post) =>
              post?.id ? <ItemBanner {...post} key={post.id} /> : null
            )
          : index === 1
          ? followingData?.seeFollowing?.map((user) =>
              user ? <FollowingBanner key={user.id + ''} {...user} /> : null
            )
          : null}
      </Bottom>
    </>
  );
}

export default ProfileBottom;
