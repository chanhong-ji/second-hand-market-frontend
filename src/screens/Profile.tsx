import { ApolloCache, gql, useMutation, useQuery } from '@apollo/client';
import { useViewportScroll } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from '../components/Avatar';
import Loader from '../components/Loader';
import PageTitle from '../components/PageTitle';
import ProfileBottom from '../components/ProfileBottom';
import { USER_FRAGMENT } from '../fragment';
import GetMeUser from '../hooks/getMeUser';
import { seeProfile } from '../__generated__/seeProfile';
import {
  toggleFollow,
  toggleFollowVariables,
} from '../__generated__/toggleFollow';
import NotFound from './NotFound';

const Wrapper = styled.div`
  margin-top: 5px;
  min-height: 800px;
`;
const Top = styled.article`
  padding: 50px 0;
  display: flex;
`;
const Btn = styled.div`
  padding: 7px;
  border-radius: 10px;
  font-size: 20px;
  color: white;
  margin-left: 10px;
  cursor: pointer;
  background-color: ${(p) => p.theme.color.accent};
`;
const Zone = styled.div``;
const Count = styled.div``;
const Following = styled.div``;
const Username = styled.div``;
const Row = styled.div``;
const FollowBtn = styled(Btn)``;
const OwnerBtn = styled(Btn)``;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  ${Row} {
    display: flex;
    align-items: flex-end;
    :first-child {
      margin-bottom: 13px;
    }
    ${Username} {
      font-size: 35px;
      margin-right: 20px;
    }
    ${Zone} {
      font-size: 17px;
      color: rgba(0, 0, 0, 0.6);
    }
    ${Count} {
      font-size: 15px;
    }
    ${Following} {
      font-size: 15px;
      margin-left: 10px;
    }
  }
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($id: Int!, $offset: Int) {
    seeProfile(id: $id, offset: $offset) {
      ...UserFragment
      posts(offset: $offset) {
        id
        title
        photos
        dealt
        price
        interestsCount
        zone {
          id
          name
        }
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const TOGGLE_FOLLOW_MUTATION = gql`
  mutation toggleFollow($id: Int!) {
    toggleFollow(id: $id) {
      ok
      error
    }
  }
`;

function Profile() {
  const onToggleUpdate = (cache: ApolloCache<any>, result: any) => {
    const {
      toggleFollow: { ok, error },
    } = result.data;
    if (!ok) return alert(error);
    if (!!!data?.seeProfile) return;

    let follow = false;
    cache.modify({
      id: `User:${data.seeProfile.id}`,
      fields: {
        isFollowing(prev) {
          return !prev;
        },
        followerCount(prev, { readField }) {
          const isFollowing = readField('isFollowing');
          follow = !isFollowing;
          return isFollowing ? prev - 1 : prev + 1;
        },
      },
    });

    cache.modify({
      id: `User:${meData?.me?.id}`,
      fields: {
        followingCount(prev) {
          return follow ? prev + 1 : prev - 1;
        },
      },
    });
  };

  const onToggleFollow = () => {
    if (data?.seeProfile?.id) {
      toggleFollow({ variables: { id: +data.seeProfile.id } });
    }
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const { scrollYProgress } = useViewportScroll();
  const meData = GetMeUser();
  const { data, loading, fetchMore, refetch } = useQuery<seeProfile>(
    SEE_PROFILE_QUERY,
    {
      skip: !!!/^\d+$/.test(id || ''),
      variables: { id: id ? +id : null, offset: 0 },
    }
  );
  const [toggleFollow] = useMutation<toggleFollow, toggleFollowVariables>(
    TOGGLE_FOLLOW_MUTATION,
    { update: onToggleUpdate }
  );

  useEffect(() => {
    if (!!/^\d+$/.test(id || '')) {
      refetch({
        variable: {
          id,
        },
      });
    }
  }, [id]);

  useEffect(() => {
    scrollYProgress.onChange(async (value) => {
      if (value > 0.95 && !!data?.seeProfile) {
        await fetchMore({
          variables: {
            id: +data.seeProfile.id,
            offset: data.seeProfile.posts?.length,
          },
        });
        scrollYProgress.clearListeners();
      }
    });
  }, [data]);

  return (
    <Wrapper>
      <PageTitle title='Profile' />
      {!!/^\d+$/.test(id || '') ? (
        loading ? (
          <Loader />
        ) : data?.seeProfile === null ? (
          <NotFound>no user</NotFound>
        ) : (
          <>
            <Top>
              <Avatar url={data?.seeProfile?.avatar} size={80} />
              <Info>
                <Row>
                  <Username>{data?.seeProfile?.name}</Username>
                  <Zone>{data?.seeProfile?.zone?.name}</Zone>
                  {!!!data?.seeProfile?.isMe && (
                    <FollowBtn onClick={onToggleFollow}>
                      {data?.seeProfile?.isFollowing ? 'UnFollow' : 'Follow'}
                    </FollowBtn>
                  )}
                  {!!data?.seeProfile?.isMe && (
                    <OwnerBtn
                      onClick={() => {
                        navigate('edit');
                      }}
                    >
                      Edit Profile
                    </OwnerBtn>
                  )}
                </Row>
                <Row>
                  <Count>거래건수: {data?.seeProfile?.dealtCount}</Count>
                  <Following>
                    팔로워 수: {data?.seeProfile?.followerCount}
                  </Following>
                </Row>
              </Info>
            </Top>
            {data?.seeProfile && <ProfileBottom {...data.seeProfile} />}
          </>
        )
      ) : (
        <NotFound>Wrong access</NotFound>
      )}
    </Wrapper>
  );
}

export default Profile;
