import { ApolloCache, gql, useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from '../components/Avatar';
import ItemBanner from '../components/ItemBanner';
import PageTitle from '../components/PageTitle';
import { USER_FRAGMENT } from '../fragment';
import { seeProfile } from '../__generated__/seeProfile';
import {
  toggleFollow,
  toggleFollowVariables,
} from '../__generated__/toggleFollow';

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

const Column = styled.div``;
const NavBar = styled.div`
  border-bottom: 1px solid ${(p) => p.theme.color.border};
  display: flex;
  align-items: center;
  ${Column} {
    border-bottom: 3px solid tomato;
    padding: 10px 20px;
  }
`;

const Bottom = styled.article`
  width: 100%;
  padding: 50px 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
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

const TOGGLE_FOLLOW_MUTATION = gql`
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
    if (!ok) return;

    cache.modify({
      id: `User:${data?.seeProfile?.id}`,
      fields: {
        isFollowing(prev) {
          return !prev;
        },
        followingCount(prev, { readField }) {
          const isFollowing = readField('isFollowing');
          return isFollowing ? prev - 1 : prev + 1;
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
  const { data, loading } = useQuery<seeProfile>(SEE_PROFILE_QUERY, {
    skip: !!!/^\d+$/.test(id || ''),
    variables: { id: id ? +id : null, offset: 0 },
  });
  const [toggleFollow, { loading: toggleLoading }] = useMutation<
    toggleFollow,
    toggleFollowVariables
  >(TOGGLE_FOLLOW_MUTATION, { update: onToggleUpdate });

  useEffect(() => {
    if (!!!/^\d+$/.test(id || '')) {
      navigate('/notfound', { state: { type: 'profile' } });
    }
  }, [id]);
  return (
    <Wrapper>
      <PageTitle title='Profile' />
      {/* user location */}
      {loading ? (
        <div></div>
      ) : (
        // loading component
        <>
          <Top>
            <Avatar url={data?.seeProfile?.avatar || ''} size={80} />
            <Info>
              <Row>
                <Username>{data?.seeProfile?.name}</Username>
                <Zone>{data?.seeProfile?.zone?.name}</Zone>
                {/* zone 리스트로 navigate */}
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
                <Count>
                  거래건수:{' '}
                  {
                    data?.seeProfile?.posts?.filter(
                      (post) => post?.dealt === false
                    ).length
                  }
                </Count>
                <Following>
                  팔로워 수: {data?.seeProfile?.followingCount}
                </Following>
              </Row>
            </Info>
          </Top>
          <NavBar>
            <Column>판매물품 ({data?.seeProfile?.postsCount})</Column>
            <Column>거래 후기</Column>
          </NavBar>
          <Bottom>
            {data?.seeProfile?.posts?.map((post) =>
              post?.id ? <ItemBanner {...post} key={post.id} /> : null
            )}
          </Bottom>
          {/* dealt 구분하기 */}
        </>
      )}
    </Wrapper>
  );
}

export default Profile;
