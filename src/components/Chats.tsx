import { gql, useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import GetMeUser from '../hooks/getMeUser';
import { seeRoom_seeRoom_messages } from '../__generated__/seeRoom';
import {
  sendMessage,
  sendMessageVariables,
} from '../__generated__/sendMessage';
import { useNavigate } from 'react-router-dom';

const Container = styled.div``;
const Form = styled.div``;
const UnreadDot = styled.div``;
const Chat = styled.div<{ mine: boolean }>`
  align-self: ${(p) => (p.mine ? 'flex-end' : 'flex-start')};
  color: ${(p) => (p.mine ? 'black' : 'white')};
  background-color: ${(p) =>
    p.mine ? p.theme.color.main : p.theme.color.accent};
`;
const Button = styled.div<{ isValid: boolean }>`
  background-color: ${(p) =>
    p.isValid ? p.theme.color.accent : 'rgba(0, 0, 0, 0.3)'};
  cursor: ${(p) => (p.isValid ? 'pointer' : 'default')};
`;
const Wrapper = styled.div`
  padding: 0 20px;
  position: relative;
  padding-bottom: 130px;
  display: flex;
  height: ${(p) => p.theme.size.room.height.chat};
  ${Container} {
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    ::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
    ${Chat} {
      padding: 13px 15px;
      max-width: 400px;
      border-radius: 15px;
      font-size: 17px;
      line-height: 1.3;
      margin: 7px 0;
      position: relative;
      ${UnreadDot} {
        position: absolute;
        left: -5px;
        top: 0;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background-color: ${(p) => p.theme.color.blue};
      }
    }
  }
  ${Form} {
    position: absolute;
    width: 100%;
    height: 130px;
    bottom: 0;
    left: 0;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    display: flex;
    form {
      flex-grow: 1;
      border: 2px solid rgba(0, 0, 0, 0.3);
      border-radius: 20px;
      position: relative;
      textarea {
        outline: none;
        background: none;
        border: none;
        padding: 16px;
        width: 100%;
        height: 70%;
        font-size: 16px;
      }
      ${Button} {
        position: absolute;
        bottom: 15px;
        right: 15px;
        padding: 7px 12px;
        border-radius: 10px;
        font-size: 16px;
        color: white;
      }
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($postId: Int!, $payload: String!) {
    sendMessage(postId: $postId, payload: $payload) {
      ok
      id
      error
    }
  }
`;

interface IProps {
  messages?: (seeRoom_seeRoom_messages | null)[];
  postId: number;
}

function Chats({ messages, postId }: IProps) {
  const onValid: SubmitHandler<sendMessageVariables> = ({ payload }) => {
    if (loading) return;
    setValue('payload', '');
    sendMessage({
      variables: {
        postId,
        payload,
      },
    });
  };

  const meData = GetMeUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isValid },
    setValue,
  } = useForm<sendMessageVariables>({ mode: 'onChange' });
  const [sendMessage, { loading }] = useMutation<
    sendMessage,
    sendMessageVariables
  >(SEND_MESSAGE_MUTATION, {
    onCompleted: (data) => {
      if (data.sendMessage?.id) {
        navigate(`/room/${data.sendMessage.id}`);
      }
    },
  });

  return (
    <Wrapper>
      <Container>
        {messages?.map((message) => (
          <Chat key={message?.id} mine={message?.userId == meData?.me?.id}>
            {message?.userId === meData?.me?.id && !message?.read && (
              <UnreadDot />
            )}
            {message?.payload}
          </Chat>
        ))}
      </Container>
      <Form onSubmit={handleSubmit(onValid)}>
        <form>
          <textarea
            {...register('payload', {
              required: true,
              onChange: (e) => setValue('payload', e.target.value),
            })}
            maxLength={800}
          />
          <Button
            onClick={handleSubmit(onValid)}
            isValid={isValid && !!!loading}
          >
            Send
          </Button>
        </form>
      </Form>
    </Wrapper>
  );
}

export default Chats;
