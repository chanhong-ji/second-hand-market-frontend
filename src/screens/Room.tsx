import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { UpdateQueryFn } from '@apollo/client/core/watchQueryOptions';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  height: 100%;
  display: flex;
  flex-direction: column;
  ${TalkingTo} {
    border-bottom: 1px solid ${(p) => p.theme.color.border};
    height: 70px;
    display: flex;
    align-items: center;
    padding: 10px;
    img {
    }
    ${Username} {
      margin-left: 10px;
      font-size: 20px;
      cursor: pointer;
    }
  }
  ${PostInfo} {
    border-bottom: 1px solid ${(p) => p.theme.color.border};
    padding: 20px;
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
  const onCompleteQuery = (data: seeRoom) => {
    setTalkingTo(
      data.seeRoom?.users.find((user) => user?.id !== meData?.me?.id) ?? {}
    );

    data.seeRoom?.messages.forEach((mes) => {
      if (!mes?.read && mes?.id && mes.userId !== meData?.me?.id) {
        readMessage({ variables: { messageId: mes?.id } });
      }
    });
  };

  const updateQuery: UpdateQueryFn<any, updateRoomVariables, updateRoom> = (
    _,
    { subscriptionData: { data } }
  ) => {
    if (!data.updateRoom) return;
    if (!data.updateRoom.read) {
      const messageFragment = cache.writeFragment({
        fragment: MESSAGE_FRAGMENT,
        data: data.updateRoom.message,
      });
      cache.modify({
        id: `Room:${roomId}`,
        fields: {
          messages: (prev) => [messageFragment, ...prev],
        },
      });
    }
  };

  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [subscribed, setSubscribed] = useState(false);
  const { cache } = useApolloClient();
  const meData = GetMeUser();
  const [talkingTo, setTalkingTo] = useState<any>();
  const [readMessage] = useMutation<readMessage, readMessageVariables>(
    READ_MESSAGE_MUTATION
  );
  const { data, subscribeToMore, refetch } = useQuery<seeRoom>(SEE_ROOM_QUERY, {
    skip: !!!roomId || !!!/^\d+$/.test(roomId),
    variables: { roomId: roomId ? +roomId : 0 },
    onCompleted: onCompleteQuery,
  });

  useEffect(() => {
    if (
      roomId &&
      data?.seeRoom?.id &&
      !subscribed &&
      data.seeRoom.id == +roomId
    ) {
      subscribeToMore({
        document: UPDATE_ROOM_SUBSCRIPTION,
        variables: {
          roomId: data.seeRoom.id,
        },
        updateQuery,
      });
      setSubscribed(true);
    }
  }, [data, subscribed]);

  useEffect(() => {
    if (roomId) {
      refetch({ roomId: +roomId });
    }
  }, []);

  return (
    <Wrapper>
      {!!data && (
        <>
          {talkingTo && (
            <TalkingTo>
              <Avatar size={50} url={talkingTo.avatar} />
              <Username onClick={() => navigate(`/profiles/${talkingTo.id}/`)}>
                {talkingTo.name}
              </Username>
            </TalkingTo>
          )}
          <PostInfo onClick={() => navigate(`/posts/${data.seeRoom?.postId}`)}>
            {data.seeRoom?.post.title}
          </PostInfo>
          {data.seeRoom?.messages && (
            <Chats
              postId={data.seeRoom.postId}
              messages={data.seeRoom.messages}
            />
          )}
        </>
      )}
    </Wrapper>
  );
}
export default Room;
