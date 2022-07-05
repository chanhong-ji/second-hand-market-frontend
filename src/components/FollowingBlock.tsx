import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useViewportScroll } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { zoneFirst, zoneSecond } from '../dataList';
import GetMeUser from '../hooks/getMeUser';
import { TOGGLE_FOLLOW_MUTATION } from '../screens/Profile';
import { onToggleFollowUpdate } from '../shared/utils';
import { seeFollowing } from '../__generated__/seeFollowing';
import { seeProfile_seeProfile } from '../__generated__/seeProfile';
import {
  toggleFollow,
  toggleFollowVariables,
} from '../__generated__/toggleFollow';
import Avatar from './Avatar';
import { useRecoilState } from 'recoil';
import { followingCountState } from '../atoms';

const Username = styled.div``;
const Zone = styled.div``;
const FollowBtn = styled.div``;
const Container = styled.div``;
const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  cursor: pointer;
  img {
    margin-left: 10px;
  }
  ${Container} {
    height: 100%;
    padding-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-x: hidden;
    ${Username} {
      font-size: 20px;
      border-radius: 600;
    }
    ${Zone} {
      margin-top: 6px;
      font-size: 15px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
  > div:last-child {
    flex-grow: 1;
    display: flex;
    justify-content: end;
    padding-right: 20px;
    ${FollowBtn} {
      padding: 10px;
      background-color: tomato;
      color: white;
      border-radius: 8px;
      opacity: 0.7;
      :hover {
        opacity: 1;
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
          rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
        :active {
          box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
        }
      }
    }
  }
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

function FollowingBlock(props: seeProfile_seeProfile) {
  const navigate = useNavigate();
  const meData = GetMeUser();
  const { scrollYProgress } = useViewportScroll();
  const [followingCount, setFollowingCount] =
    useRecoilState(followingCountState);
  const {
    data: followingData,
    refetch,
    fetchMore,
  } = useQuery<seeFollowing>(SEE_FOLLOWING_QUERY, {
    variables: { userId: props.id },
  });
  const [toggleFollow] = useMutation<toggleFollow, toggleFollowVariables>(
    TOGGLE_FOLLOW_MUTATION,
    {
      update: (cache, result) =>
        onToggleFollowUpdate(cache, result, meData?.me?.id),
    }
  );

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

  const refetching: any = useApolloClient().cache.readFragment({
    id: `User:${props.id}`,
    fragment: gql`
      fragment UserFragmentForFollowing on User {
        followingCount
      }
    `,
  });

  useEffect(() => {
    if (
      refetching?.followingCount &&
      refetching.followingCount !== followingCount
    ) {
      setFollowingCount(refetching.followingCount);
      refetch({ variable: { userId: props.id } });
    }
  }, []);

  const onFollowBtn = (user: any) => {
    toggleFollow({ variables: { id: user.id } });
  };

  return (
    <>
      {followingData?.seeFollowing?.map((user) =>
        user ? (
          <Wrapper
            key={user.id + ''}
            onClick={() => navigate(`/profiles/${user.id}`)}
          >
            <Avatar url={user.avatar} size={60} />
            <Container>
              <Username>{user.name}</Username>

              <Zone>
                {zoneFirst[+user.zoneId.slice(0, -2)]}{' '}
                {zoneSecond[+user.zoneId.slice(0, -2)][+user.zoneId.slice(-2)]}{' '}
              </Zone>
            </Container>
            <div>
              <FollowBtn
                onClick={(e) => {
                  e.stopPropagation();
                  onFollowBtn(user);
                }}
              >
                {user.isFollowing ? 'unFollow' : 'Follow'}
              </FollowBtn>
            </div>
          </Wrapper>
        ) : null
      )}
    </>
  );
}

export default FollowingBlock;
