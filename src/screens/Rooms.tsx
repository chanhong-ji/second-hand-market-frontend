import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from '../components/Avatar';
import { ROOM_FRAGMENT_FOR_ROOMS } from '../fragment';
import GetMeUser from '../hooks/getMeUser';
import { seeRooms } from '../__generated__/seeRooms';

const RoomSpace = styled.div``;
const List = styled.div``;
const MeName = styled.div``;
const Mine = styled.div``;
const UnReadMark = styled.div``;
const RoomBanner = styled.div``;
const Username = styled.div``;
const Wrapper = styled.div`
  width: 100%;
  min-width: 800px;
  height: ${(p) => p.theme.size.room.height.whole};
  margin-top: 30px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  ${List} {
    background-color: white;
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    ::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
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
  }
  ${RoomSpace} {
    background-color: white;
    border-left: 1px solid ${(p) => p.theme.color.border};
    height: ${(p) => p.theme.size.room.height.whole};
  }
`;

const SEE_ROOMS_QUERY = gql`
  query seeRooms($offset: Int) {
    seeRooms(offset: $offset) {
      ...RoomFragmentForRooms
    }
  }
  ${ROOM_FRAGMENT_FOR_ROOMS}
`;

function Rooms() {
  const meData = GetMeUser();
  const navigate = useNavigate();
  const { data, refetch } = useQuery<seeRooms>(SEE_ROOMS_QUERY, {
    skip: !!!meData?.me?.id,
  });
  const params = useParams();

  useEffect(() => {
    refetch();
  }, [params]);

  return (
    <Wrapper>
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
                {room.unreadTotal !== 0 && <UnReadMark />}
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
      <RoomSpace>
        <Outlet />
      </RoomSpace>
    </Wrapper>
  );
}
export default Rooms;
