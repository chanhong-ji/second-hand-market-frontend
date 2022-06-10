import { gql, useMutation } from '@apollo/client';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from '../components/Modal';
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

const Left = styled.div<{ url: string | null }>`
  background-image: ${(p) => (p.url ? `url('${p.url}')` : 'none')};
  background-color: whitesmoke;
  border-bottom-left-radius: 20px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  height: 100%;
`;
const Right = styled.div`
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

  return (
    <Modal
      title='Edit'
      completeFn={handleSubmit(onValid, onInValid)}
      styles={{ gridTemplateColumns: '3fr 2fr' }}
    >
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
    </Modal>
  );
}

export default EditPost;
