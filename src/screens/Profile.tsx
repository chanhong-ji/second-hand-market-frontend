import { gql, useMutation, useQuery } from '@apollo/client';
import { useViewportScroll } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from '../components/Avatar';
import Loader from '../components/Loader';
import PageTitle from '../components/PageTitle';
import ProfileBottom from '../components/ProfileBottom';
import { POST_FRAGMENT_FOR_BANNER, USER_FRAGMENT } from '../fragment';
import GetMeUser from '../hooks/getMeUser';
import { onToggleFollowUpdate } from '../shared/utils';
import { seeProfile } from '../__generated__/seeProfile';
import {
  toggleFollow,
  toggleFollowVariables,
} from '../__generated__/toggleFollow';
import NotFound from './NotFound';

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
const Info = styled.div``;
const Top = styled.article``;
const Wrapper = styled.div`
  margin-top: 5px;
  min-height: 800px;
  ${Top} {
    padding: 50px 0;
    padding-left: 20px;
    display: flex;
    ${Info} {
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
    }
  }
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($id: Int!, $offset: Int) {
    seeProfile(id: $id, offset: $offset) {
      ...UserFragment
      posts(offset: $offset) {
        ...PostFragmentForBanner
      }
    }
  }
  ${USER_FRAGMENT}
  ${POST_FRAGMENT_FOR_BANNER}
`;

export const TOGGLE_FOLLOW_MUTATION = gql`
  mutation toggleFollow($id: Int!) {
    toggleFollow(userId: $id) {
      ok
      error
      id
    }
  }
`;

function Profile() {
  const onFollowBtnClicked = () => {
    if (data?.seeProfile?.id) {
      toggleFollow({ variables: { id: +data.seeProfile.id } });
    }
  };

  const getMoreDataWithScroll = () => {
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
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const { scrollYProgress } = useViewportScroll();
  const meData = GetMeUser();
  const { state }: any = useLocation();
  const { data, loading, fetchMore, refetch } = useQuery<seeProfile>(
    SEE_PROFILE_QUERY,
    {
      skip: !id || !!!/^\d+$/.test(id),
      variables: { id: id ? +id : 0, offset: 0 },
    }
  );
  const [toggleFollow] = useMutation<toggleFollow, toggleFollowVariables>(
    TOGGLE_FOLLOW_MUTATION,
    {
      update: (cache, result) =>
        onToggleFollowUpdate(cache, result, meData?.me?.id),
    }
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
    if (data?.seeProfile) {
      getMoreDataWithScroll();
    }
  }, [data]);

  return (
    <Wrapper>
      <PageTitle title={`${state?.name ?? data?.seeProfile?.name}'s Profile`} />
      {!!/^\d+$/.test(id || '') ? (
        loading ? (
          <Loader />
        ) : data?.seeProfile === null ? (
          <NotFound>No User found</NotFound>
        ) : (
          <>
            <Top>
              <Avatar url={data?.seeProfile?.avatar} size={80} />
              <Info>
                <Row>
                  <Username>{data?.seeProfile?.name}</Username>
                  <Zone>{data?.seeProfile?.zoneName}</Zone>
                  {!data?.seeProfile?.isMe && !!meData?.me && (
                    <FollowBtn onClick={onFollowBtnClicked}>
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
