import { ApolloCache, gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { zoneFirst, zoneSecond } from '../dataList';
import GetMeUser from '../hooks/getMeUser';
import { TOGGLE_FOLLOW_MUTATION } from '../screens/Profile';
import {
  toggleFollow,
  toggleFollowVariables,
} from '../__generated__/toggleFollow';
import Avatar from './Avatar';

interface IProps {
  id: number;
  name: string;
  avatar: string | null;
  zoneId: string;
  isFollowing: boolean;
}
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

function FollowingBanner(user: IProps) {
  const onToggleUpdate = (cache: ApolloCache<any>, result: any) => {
    const {
      toggleFollow: { ok, error },
    } = result.data;
    if (!ok) {
      return alert(error);
    } else if (!meData?.me) {
      return alert('No meData');
    }

    let follow = false;
    cache.modify({
      id: `User:${user.id}`,
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
      id: `User:${meData.me.id}`,
      fields: {
        followingCount(prev) {
          return follow ? prev + 1 : prev - 1;
        },
      },
    });
  };

  const first = zoneFirst[+user.zoneId.slice(0, -2)];
  const second = zoneSecond[+user.zoneId.slice(0, -2)][+user.zoneId.slice(-2)];
  const navigate = useNavigate();
  const meData = GetMeUser();
  const [toggleFollow] = useMutation<toggleFollow, toggleFollowVariables>(
    TOGGLE_FOLLOW_MUTATION,
    { update: onToggleUpdate }
  );

  const onFollowBtn = () => {
    toggleFollow({ variables: { id: user.id } });
  };

  return (
    <Wrapper onClick={() => navigate(`/profiles/${user.id}`)}>
      <Avatar url={user.avatar} size={60} onClick={() => {}} />
      <Container>
        <Username>{user.name}</Username>
        <Zone>
          {first} {second}
        </Zone>
      </Container>
      <div>
        <FollowBtn
          onClick={(e) => {
            e.stopPropagation();
            onFollowBtn();
          }}
        >
          {user.isFollowing ? 'unFollow' : 'Follow'}
        </FollowBtn>
      </div>
    </Wrapper>
  );
}

export default FollowingBanner;
