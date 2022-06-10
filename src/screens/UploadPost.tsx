import { gql, useMutation } from '@apollo/client';
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faPlusCircle,
  faRotate,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import { createPost, createPostVariables } from '../__generated__/createPost';
import { useNavigate } from 'react-router-dom';
import GetMeUser from '../hooks/getMeUser';

const Preview = styled.div``;
const Left = styled.div`
  background-color: whitesmoke;
  border-bottom-left-radius: 20px;
  height: 100%;
  position: relative;
  label {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    padding: 10px;
    border-radius: 5px;
    opacity: 0.5;
    cursor: pointer;
    :hover {
      opacity: 1;
    }
    :last-of-type {
      right: 50px;
    }
  }
  input {
    display: none;
  }
  ${Preview} {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    * {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      position: absolute;
      cursor: pointer;
    }
    .nextBtn {
      top: 50%;
      right: 10px;
      color: white;
    }
    .prevBtn {
      top: 50%;
      left: 10px;
      color: white;
    }
    .deleteBtn {
      top: 10px;
      right: 10px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
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

const CREATE_POST_MUTATION = gql`
  mutation createPost(
    $title: String!
    $caption: String!
    $photos: [Upload!]!
    $categoryId: Int!
  ) {
    createPost(
      title: $title
      caption: $caption
      photos: $photos
      categoryId: $categoryId
    ) {
      ok
      error
    }
  }
`;

interface IUploadForm {
  add: File | null;
  change: File | null;
}

function UploadPost() {
  const onInValid: SubmitErrorHandler<createPostVariables> = ({
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

  const onValid: SubmitHandler<createPostVariables> = async ({
    title,
    caption,
    categoryId,
  }) => {
    if (loading) return;
    const li = await Promise.all(
      photoUrls.map((url) => fetch(url).then((r) => r.blob()))
    );
    // 카테고리 수정
    createPost({ variables: { title, caption, categoryId: 1, photos: li } });
  };

  const onCompleted = (data: createPost) => {
    const {
      createPost: { ok, error },
    } = data;
    if (!ok) return alert('fail');
    navigate(`/profiles/${meData?.me?.id}`);
  };

  const onPrevBtn = () => {
    setPhotoPage((prev) => prev - 1);
  };

  const onNextBtn = () => {
    setPhotoPage((prev) => prev + 1);
  };

  const onDeleteBtn = () => {
    setPhotoUrls((prev) => {
      let newPhotos = [...prev];
      newPhotos.splice(photoPage - 1, 1);
      return newPhotos;
    });
    setPhotoPage((prev) => (prev === 1 ? 1 : prev - 1));
  };

  const onAddPhoto = (input: any) => {
    if (photoUrls.length >= 3) {
      return;
    }
    if (input.target.files[0]) {
      const photoUrl = URL.createObjectURL(input.target?.files[0]);
      if (photoUrl) setPhotoUrls((prev) => [...prev, photoUrl]);
    }
    setValue('add', null);
  };

  const onChangePhoto = (input: any) => {
    if (input.target.files[0]) {
      const photoUrl = URL.createObjectURL(input.target?.files[0]);
      setPhotoUrls((prev) => {
        const newPhotos = [...prev];
        newPhotos.splice(photoPage - 1, 1, photoUrl);
        return newPhotos;
      });
    }
    setValue('change', null);
  };

  const [createPost, { loading }] = useMutation<
    createPost,
    createPostVariables
  >(CREATE_POST_MUTATION, { onCompleted });
  const { register, handleSubmit, setValue } = useForm<
    createPostVariables & IUploadForm
  >();
  const navigate = useNavigate();
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoPage, setPhotoPage] = useState(1);
  const meData = GetMeUser();

  return (
    <Modal
      title='Upload'
      completeFn={handleSubmit(onValid, onInValid)}
      styles={{ gridTemplateColumns: '3fr 2fr' }}
    >
      <Left>
        <label
          htmlFor='add'
          style={{
            ...(photoUrls.length >= 3 && { opacity: 0.2, cursor: 'default' }),
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} />
        </label>
        <input
          {...register('add', {
            onChange: onAddPhoto,
          })}
          type='file'
          id='add'
          accept='image/png, image/jpeg'
          disabled={photoUrls.length >= 3}
        />

        <label htmlFor='change'>
          <FontAwesomeIcon icon={faRotate} />
        </label>
        <input
          {...register('change', {
            onChange: onChangePhoto,
          })}
          type='file'
          id='change'
          accept='image/png, image/jpeg'
          disabled={photoUrls.length < photoPage}
        />

        {photoUrls.map((photoUrl, index) =>
          index + 1 === photoPage ? (
            <Preview
              style={{ backgroundImage: `url(${photoUrl})` }}
              key={index}
            >
              {photoUrls.length > index + 1 && (
                <FontAwesomeIcon
                  icon={faArrowCircleRight}
                  onClick={onNextBtn}
                  className='nextBtn'
                />
              )}
              {index > 0 && (
                <FontAwesomeIcon
                  icon={faArrowCircleLeft}
                  onClick={onPrevBtn}
                  className='prevBtn'
                />
              )}
              <FontAwesomeIcon
                icon={faXmarkCircle}
                onClick={onDeleteBtn}
                className='deleteBtn'
              />
            </Preview>
          ) : null
        )}
      </Left>

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
              // 카테고리 수정
            />
          </div>
        </form>
      </Right>
    </Modal>
  );
}

export default UploadPost;
