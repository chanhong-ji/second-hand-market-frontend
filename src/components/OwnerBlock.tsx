import Avatar from '../components/Avatar';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  toggleInterest,
  toggleInterestVariables,
} from '../__generated__/toggleInterest';
import { ApolloCache, gql, useMutation } from '@apollo/client';
import { deletePost, deletePostVariables } from '../__generated__/deletePost';
import {
  getDealtPost,
  getDealtPostVariables,
} from '../__generated__/getDealtPost';
import { seePost_seePost } from '../__generated__/seePost';
import { onToggleInterestUpdate } from '../shared/utils';
import GetMeUser from '../hooks/getMeUser';

const BtnForLoggedIn = styled.div<{ notLogged: boolean }>`
  opacity: ${(p) => (p.notLogged ? 0.4 : 1)};
  cursor: ${(p) => (p.notLogged ? 'default' : 'pointer')};
`;
const Container = styled.div``;
const Left = styled.div``;
const Username = styled.div``;
const Zone = styled.div``;
const Right = styled.div``;
const Row = styled.div``;
const Interest = styled.div``;
const Chat = styled.div``;
const ChatBtn = styled(BtnForLoggedIn)``;
const BookmarkBtn = styled(BtnForLoggedIn)``;
const DeleteBtn = styled.div``;
const DealtBtn = styled.div``;
const Owner = styled.div`
  width: 100%;
  padding: 20px 0;
  padding-right: 10px;
  display: flex;
  justify-content: space-between;
  ${Left} {
    display: flex;
    align-items: center;
    ${Container} {
      margin-left: 10px;
      ${Username} {
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
      }
      ${Zone} {
        font-size: 15px;
        margin-top: 5px;
      }
    }
  }
  ${Right} {
    display: flex;
    flex-direction: column;
    ${Row}:first-child {
      display: flex;
      justify-content: flex-end;
      ${Interest},
      ${Chat} {
        margin-left: 15px;
        color: rgba(0, 0, 0, 0.8);
        * {
          font-size: 17px;
        }
        span {
          margin-left: 5px;
        }
      }
    }
    ${Row}:last-child {
      display: flex;
      margin-top: 10px;
      justify-content: flex-end;
      ${ChatBtn},
      ${BookmarkBtn},
      ${DeleteBtn},
      ${DealtBtn} {
        font-size: 13px;
        padding: 8px;
        background-color: ${(p) => p.theme.color.accent};
        color: white;
        border-radius: 10px;
        margin-left: 5px;
      }
      ${DeleteBtn},
      ${DealtBtn} {
        font-size: 10px;
        border-radius: 5px;
        opacity: 0.7;
        cursor: pointer;
        :hover {
          opacity: 1;
        }
      }
    }
  }
`;

export const TOGGLE_INTEREST_MUTATION = gql`
  mutation toggleInterest($id: Int!) {
    toggleInterest(id: $id) {
      ok
      error
      id
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation deletePost($deletePostId: Int!) {
    deletePost(id: $deletePostId) {
      ok
      error
    }
  }
`;

const GET_DEALT_POST_MUTATION = gql`
  mutation getDealtPost($getDealtPostId: Int!) {
    getDealtPost(id: $getDealtPostId) {
      ok
      error
    }
  }
`;

function OwnerBlock({
  id: postId,
  title: postTitle,
  dealt,
  price: postPrice,
  user,
  zone,
  isMine,
  hasRoom,
  isInterest,
  interestsCount,
  roomCount,
}: seePost_seePost) {
  const onBookmark = () => {
    if (!!!meData) return;
    toggleInterest({ variables: { id: postId } });
  };
  const onSendChat = () => {
    if (!!!meData) return;
    if (hasRoom == -1) {
      navigate(`/room/chat`, {
        state: {
          id: user.id,
          avatar: user.avatar,
          name: user.name,
          postId,
          postTitle,
          postPrice,
        },
      });
    } else {
      navigate(`/room/${hasRoom}`);
    }
  };
  const onDeletePost = async () => {
    const answer = await window.confirm('Are you sure to delete this post?');
    if (answer) {
      deletePost();
    }
  };
  const onDealtBtn = async () => {
    const answer = await window.confirm('Is this a post completed?');
    if (answer) {
      getDealtPost();
    }
  };
  const onDealtUpdate = (cache: ApolloCache<any>, result: any) => {
    const {
      getDealtPost: { ok, error },
    } = result.data;
    if (!ok) return alert(error);

    cache.modify({
      id: `Post:${postId}`,
      fields: {
        dealt: () => true,
      },
    });
  };

  const navigate = useNavigate();
  const meData = GetMeUser();
  const [toggleInterest] = useMutation<toggleInterest, toggleInterestVariables>(
    TOGGLE_INTEREST_MUTATION,
    {
      update: (cache, result) =>
        onToggleInterestUpdate(cache, result, meData?.me?.id),
    }
  );
  const [deletePost] = useMutation<deletePost, deletePostVariables>(
    DELETE_POST_MUTATION,
    {
      variables: { deletePostId: postId },
      onCompleted: (data) => {
        const {
          deletePost: { ok },
        } = data;
        if (!ok) return;
        navigate(`/profiles/${user.id}`);
      },
      update: (cache, result) => {
        if (!!!result.data?.deletePost.ok) return;
        cache.evict({
          id: `Post:${postId}`,
        });
      },
    }
  );
  const [getDealtPost] = useMutation<getDealtPost, getDealtPostVariables>(
    GET_DEALT_POST_MUTATION,
    { variables: { getDealtPostId: postId }, update: onDealtUpdate }
  );

  return (
    <Owner>
      <Left>
        <Avatar
          size={40}
          url={user.avatar || null}
          onClick={() => navigate(`/profiles/${user.id}`)}
        />
        <Container>
          <Username onClick={() => navigate(`/profiles/${user.id}`)}>
            {user.name}
          </Username>
          <Zone>{zone.name}</Zone>
        </Container>
      </Left>
      <Right>
        <Row>
          <Interest>
            {isInterest ? (
              <FontAwesomeIcon icon={faSolidHeart} color='red' />
            ) : (
              <FontAwesomeIcon icon={faHeart} />
            )}
            <span>{interestsCount}</span>
          </Interest>
          <Chat>
            <FontAwesomeIcon icon={faComment} />
            <span>{roomCount}</span>
          </Chat>
        </Row>
        <Row>
          {!isMine ? (
            <>
              <ChatBtn onClick={onSendChat} notLogged={meData === undefined}>
                Send chat
              </ChatBtn>
              <BookmarkBtn
                onClick={onBookmark}
                notLogged={meData === undefined}
              >
                Book mark
              </BookmarkBtn>
            </>
          ) : dealt ? (
            <DeleteBtn onClick={onDeletePost}>Delete Post</DeleteBtn>
          ) : (
            <>
              <DealtBtn onClick={onDealtBtn}>Dealt Complete</DealtBtn>
              <DeleteBtn onClick={onDeletePost}>Delete Post</DeleteBtn>
            </>
          )}
        </Row>
      </Right>
    </Owner>
  );
}
export default OwnerBlock;
