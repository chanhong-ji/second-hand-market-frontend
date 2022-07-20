import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { UpdateQueryFn } from '@apollo/client/core/watchQueryOptions';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from '../components/Avatar';
import Chats from '../components/Chats';
import { MESSAGE_FRAGMENT, ROOM_FRAGMENT } from '../fragment';
import GetMeUser from '../hooks/getMeUser';
import {
  readMessage,
  readMessageVariables,
} from '../__generated__/readMessage';
import { seeRoom } from '../__generated__/seeRoom';
import { updateRoom, updateRoomVariables } from '../__generated__/updateRoom';

const TalkingTo = styled.div``;
const Username = styled.div``;
const PostInfo = styled.div``;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${TalkingTo} {
    border-bottom: 1px solid ${(p) => p.theme.color.border};
    height: ${(p) => p.theme.size.room.height.talkingTo};
    display: flex;
    align-items: center;
    padding: 10px;
    ${Username} {
      margin-left: 10px;
      font-size: 20px;
      cursor: pointer;
    }
  }
  ${PostInfo} {
    width: 100%;
    height: ${(p) => p.theme.size.room.height.postInfo};
    border-bottom: 1px solid ${(p) => p.theme.color.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    cursor: pointer;
    :hover {
      background-color: ${(p) => p.theme.color.border};
      transition: all 0.2s ease-in-out;
    }
  }
`;

const SEE_ROOM_QUERY = gql`
  query seeRoom($roomId: Int!, $offset: Int) {
    seeRoom(roomId: $roomId) {
      ...RoomFragment
      messages(offset: $offset) {
        ...MessageFragment
      }
    }
  }
  ${MESSAGE_FRAGMENT}
  ${ROOM_FRAGMENT}
`;

const UPDATE_ROOM_SUBSCRIPTION = gql`
  subscription updateRoom($roomId: Int!) {
    updateRoom(roomId: $roomId) {
      read
      message {
        ...MessageFragment
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;

const READ_MESSAGE_MUTATION = gql`
  mutation readMessage($messageId: Int!) {
    readMessage(messageId: $messageId) {
      ok
      error
      id
    }
  }
`;

function Room() {
  const onQueryCompleted = (data: seeRoom) => {
    if (!data.seeRoom) return;
    setTalkingTo(
      data?.seeRoom?.users.find((user) => user?.id !== meData?.me?.id) ?? {}
    );

    cache.modify({
      id: `Room:${data.seeRoom.id}`,
      fields: {
        unreadTotal: () => 0,
      },
    });

    data.seeRoom.messages.forEach((mes) => {
      if (!mes) return;
      if (!mes.read && mes.userId !== meData?.me?.id) {
        readMessage({ variables: { messageId: mes.id } });
      }
    });
  };

  const onSubscriptionUpdated: UpdateQueryFn<
    any,
    updateRoomVariables,
    updateRoom
  > = (_, { subscriptionData: { data } }) => {
    if (!data.updateRoom) return;
    const { read, message } = data.updateRoom;
    if (!read) {
      const messageFragment = cache.writeFragment({
        fragment: MESSAGE_FRAGMENT,
        data: message,
      });
      cache.modify({
        id: `Room:${message.roomId}`,
        fields: {
          messages: (prev) => [messageFragment, ...prev],
        },
      });
    }
  };

  const onSetSubscription = () => {
    if (
      !roomId ||
      !data?.seeRoom?.id ||
      subscribed ||
      data.seeRoom.id !== +roomId
    )
      return;

    subscribeToMore({
      document: UPDATE_ROOM_SUBSCRIPTION,
      variables: {
        roomId: +roomId,
      },
      updateQuery: onSubscriptionUpdated,
    });
    setSubscribed(true);
  };

  const onSetTalkingTo = () => {
    if (data === undefined && state?.id) {
      const fakeUser = {
        avatar: state.avatar,
        id: state.id,
        name: state.name,
      };
      setTalkingTo(fakeUser);
    }
  };

  const onUpdateFetchedData = () => {
    if (roomId && data?.seeRoom?.id) {
      refetch({ roomId: +roomId });
    }
  };

  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [subscribed, setSubscribed] = useState(false);
  const { cache } = useApolloClient();
  const meData = GetMeUser();
  const [talkingTo, setTalkingTo] = useState<any>();
  const [readMessage] = useMutation<readMessage, readMessageVariables>(
    READ_MESSAGE_MUTATION
  );
  const { data, subscribeToMore, refetch, fetchMore } = useQuery<seeRoom>(
    SEE_ROOM_QUERY,
    {
      skip: !!!roomId || !!!/^\d+$/.test(roomId),
      variables: { roomId: roomId ? +roomId : 0 },
      onCompleted: onQueryCompleted,
    }
  );

  useEffect(() => {
    onSetSubscription();
  }, [data, subscribed, roomId]);

  useEffect(() => {
    onSetTalkingTo();
    onUpdateFetchedData();
  }, []);

  return (
    <Wrapper>
      {!!talkingTo && (
        <TalkingTo>
          <Avatar
            size={50}
            url={talkingTo.avatar}
            onClick={() => navigate(`/profiles/${talkingTo.id}/`)}
          />
          <Username onClick={() => navigate(`/profiles/${talkingTo.id}/`)}>
            {talkingTo.name}
          </Username>
        </TalkingTo>
      )}

      {data?.seeRoom ? (
        <>
          <PostInfo onClick={() => navigate(`/posts/${data.seeRoom?.postId}`)}>
            <span>{data.seeRoom.post.title}</span>
            <span>{data.seeRoom.post.price} 원</span>
          </PostInfo>
          {data.seeRoom?.messages && (
            <Chats
              postId={data.seeRoom.postId}
              roomId={data.seeRoom.id}
              messages={data.seeRoom.messages}
              fetchMore={fetchMore}
            />
          )}
        </>
      ) : state?.postId ? (
        <>
          <PostInfo onClick={() => navigate(`/posts/${state.postId}`)}>
            <span>{state.postTitle}</span>
            <span>{state.postPrice} 원</span>
          </PostInfo>
          <Chats postId={+state.postId} />
        </>
      ) : null}
    </Wrapper>
  );
}
export default Room;
