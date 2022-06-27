import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from '../components/Avatar';
import GetMeUser from '../hooks/getMeUser';
import { seeRooms } from '../__generated__/seeRooms';

const Wrapper = styled.div<{ dHeight: number }>`
  width: 100%;
  height: ${(p) => p.dHeight - 110}px;
  box-sizing: border-box;
  padding-top: 30px;
  display: grid;
  grid-template-columns: 1fr 2fr;
`;
const MeName = styled.div``;
const Mine = styled.div``;
const UnReadMark = styled.div``;
const RoomBanner = styled.div``;
const Username = styled.div``;
const List = styled.div`
  background-color: white;
  ${Mine} {
    display: flex;
    height: 70px;
    align-items: center;
    padding-left: 10px;
    border-bottom: 1px solid ${(p) => p.theme.color.border};
    ${MeName} {
      margin-left: 10px;
      font-size: 20px;
    }
  }
  ${RoomBanner} {
    display: flex;
    align-items: center;
    padding: 12px;
    position: relative;
    border-bottom: 1px solid ${(p) => p.theme.color.border};
    cursor: pointer;
    :hover {
      background-color: ${(p) => p.theme.color.border};
      transition: all 0.2s ease-in-out;
    }
    ${UnReadMark} {
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background-color: ${(p) => p.theme.color.blue};
      position: absolute;
      top: 7px;
      left: 7px;
    }
    ${Username} {
      margin-left: 10px;
      font-size: 15px;
    }
  }
`;

const Room = styled.div`
  background-color: white;
`;

const SEE_ROOMS_QUERY = gql`
  query seeRooms($userId: Int!, $offset: Int) {
    seeRooms(userId: $userId, offset: $offset) {
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
  }
`;

function Rooms() {
  const dimensionHeight = window.innerHeight;
  const meData = GetMeUser();
  const navigate = useNavigate();
  const params = useParams();
  const { data, refetch } = useQuery<seeRooms>(SEE_ROOMS_QUERY, {
    variables: { userId: meData?.me?.id },
    skip: !!!meData?.me?.id,
  });

  useEffect(() => {
    if (params?.id && typeof +params.id === 'number') {
      refetch({ userId: meData?.me?.id });
    }
  }, [params]);

  return (
    <Wrapper dHeight={dimensionHeight}>
      <List>
        {meData?.me && (
          <Mine>
            <Avatar size={50} url={meData.me.avatar} />
            <MeName>{meData.me.name}</MeName>
          </Mine>
        )}
        {data?.seeRooms.map(
          (room) =>
            !!room && (
              <RoomBanner
                key={room.id}
                onClick={() => navigate(`/room/${room.id}`)}
              >
                {room.unreadTotal > 0 && <UnReadMark />}
                <Avatar
                  size={40}
                  url={
                    room.users.find((user) => user?.id !== meData?.me?.id)
                      ?.avatar
                  }
                />
                <Username>
                  {room.users.find((user) => user?.id !== meData?.me?.id)?.name}
                </Username>
              </RoomBanner>
            )
        )}
      </List>
      <Room>
        <Outlet />
      </Room>
    </Wrapper>
  );
}
export default Rooms;
