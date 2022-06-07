import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { editPost, editPostVariables } from '../__generated__/editPost';

interface IFormOfPost {
  result: string;
}

const EDIT_POST_MUTATION = gql`
  mutation editPost(
    $id: Int!
    $title: String
    $caption: String
    $categoryId: Int
  ) {
    editPost(
      id: $id
      title: $title
      caption: $caption
      categoryId: $categoryId
    ) {
      ok
      error
    }
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2;
`;

const TopBar = styled.div``;
const Cancel = styled.div``;
const Title = styled.div``;
const Complete = styled.div``;

const Left = styled.div<{ url: string | null }>`
  background-image: ${(p) => (p.url ? `url('${p.url}')` : 'none')};
`;
const Right = styled.div``;
const ModalDiv = styled(motion.div)`
  width: 50%;
  height: 80%;
  position: absolute;
  border-radius: 20px;
  background-color: white;
  padding-top: 40px;
  display: grid;
  grid-template-columns: 3fr 2fr;

  ${TopBar} {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    height: 40px;
    border-bottom: 1px solid ${(p) => p.theme.color.border};
    position: absolute;
    top: 0;
    padding-left: 10px;
    padding-right: 10px;

    ${Cancel} {
      color: tomato;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
    }
    ${Title} {
      font-size: 18px;
      font-weight: 500;
    }
    ${Complete} {
      color: blue;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
    }
  }
  ${Left} {
    background-color: whitesmoke;
    border-bottom-left-radius: 20px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;

    height: 100%;
  }
  ${Right} {
    background-color: white;
    border-bottom-right-radius: 20px;
    form {
      height: 100%;
      display: grid;
      grid-template-rows: 1fr 3fr 1fr 2fr;
      > div {
        border-bottom: 1px solid ${(p) => p.theme.color.border};
        padding: 10px;
        label {
          display: block;
          margin-bottom: 4px;
          font-size: 15px;
          color: grey;
          font-weight: 600;
        }
        textarea {
          width: 100%;
          border: none;
          background: none;
          outline: none;
          font-size: x-large;
        }
        textarea:last-of-type {
          font-size: large;
        }
      }
    }
  }
`;

function EditPost() {
  const onInValid: SubmitErrorHandler<editPostVariables & IFormOfPost> = ({
    title,
    caption,
  }) => {
    if (title?.message) {
      alert(title?.message);
      return;
    }
    if (caption?.message) {
      alert(title?.message);
    }
  };
  const onValid: SubmitHandler<editPostVariables> = ({
    title,
    caption,
    categoryId,
  }) => {
    if (loading || !isValid) return;
    editPost({
      variables: { id: location.state?.postId, title, caption },
      // 카테고리 추가
    });
  };
  const onCompleted = (data: editPost) => {
    const { ok, error } = data.editPost;
    if (!ok) {
      return alert(error);
    }
    alert('Success to edit post');
    navigate(`/posts/${location.state.postId}`);
    window.location.reload();
  };

  const onCancel = () => {
    const cancel = window.confirm('Do you want to cancel to edit this post?');
    if (cancel) {
      navigate(-1);
    } else {
      return;
    }
  };

  const location: any = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<editPostVariables & IFormOfPost>({
    defaultValues: {
      title: location.state?.title,
      caption: location.state?.caption,
    },
  });

  const [editPost, { loading }] = useMutation<editPost, editPostVariables>(
    EDIT_POST_MUTATION,
    { onCompleted }
  );

  const modalVariant = {
    initial: {
      opacity: 0,
      scale: 0.7,
    },
    final: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Overlay onClick={() => onCancel()}>
      <ModalDiv
        onClick={(e) => e.stopPropagation()}
        variants={modalVariant}
        initial='initial'
        animate='final'
      >
        <TopBar>
          <Cancel onClick={onCancel}>Cancel</Cancel>
          <Title>Edit post</Title>
          <Complete onClick={handleSubmit(onValid, onInValid)}>
            Complete
          </Complete>
        </TopBar>
        <Left url={location.state?.photoUrl || null}></Left>
        <Right>
          <form onSubmit={handleSubmit(onValid, onInValid)}>
            <div>
              <label htmlFor='title'>Title</label>
              <textarea
                id='title'
                cols={30}
                rows={2}
                maxLength={30}
                {...register('title', {
                  required: 'Title is requierd',
                  maxLength: {
                    value: 30,
                    message: 'Title should be under 30',
                  },
                })}
              />
            </div>

            <div>
              <label htmlFor='caption'>Explanation</label>
              <textarea
                id='caption'
                cols={30}
                rows={10}
                maxLength={800}
                {...register('caption', {
                  maxLength: {
                    value: 800,
                    message: 'Explanation should be under 800',
                  },
                })}
              />
            </div>

            <div>
              <label htmlFor='categoryId'>Category</label>
              <input
                id='categoryId'
                placeholder='categoryId'
                {...register('categoryId')}
              />
            </div>
          </form>
        </Right>
      </ModalDiv>
    </Overlay>
  );
}

export default EditPost;
