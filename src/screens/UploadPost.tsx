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
import { getFormatValue } from '../shared/utils';
import CategoryBlock from '../components/CategoryBlock';

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

const Price = styled.div``;
const Right = styled.div`
  background-color: white;
  border-bottom-right-radius: 20px;
  form {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 0.5fr 3fr 1fr 2fr;
    ${Price} {
      span {
        display: block;
        margin-top: 10px;
        font-size: 18px;
        height: 15px;
      }
      input {
        margin-top: 15px;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.3);
        outline: none;
      }
    }
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
    $price: Int!
    $caption: String!
    $photos: [Upload!]!
    $categoryName: String!
  ) {
    createPost(
      title: $title
      price: $price
      caption: $caption
      photos: $photos
      categoryName: $categoryName
    ) {
      ok
      error
    }
  }
`;

interface IUploadForm {
  add: File | null;
  change: File | null;
  currency: string;
}

function UploadPost() {
  const onInValid: SubmitErrorHandler<createPostVariables> = ({
    title,
    caption,
    categoryName,
  }) => {
    if (title?.message) {
      alert(title.message);
      return;
    }
    if (caption?.message) {
      alert(caption.message);
      return;
    }
    if (categoryName?.message) {
      alert(categoryName.message);
    }
  };

  const onValid: SubmitHandler<createPostVariables> = async ({
    title,
    caption,
    price,
    categoryName,
  }) => {
    if (loading) return;
    const li = await Promise.all(
      photoUrls.map((url) => fetch(url).then((r) => r.blob()))
    );
    // 카테고리 수정
    createPost({
      variables: { title, caption, categoryName, photos: li, price: +price },
    });
  };

  const onCompleted = (data: createPost) => {
    const {
      createPost: { ok },
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

  const onPriceData = (data: any) => {
    const value = +String(data.target.value).replaceAll(/\D/g, '') ?? 0;
    setPriceValue(value);
    const formatValue = getFormatValue(value);
    setCurrencyValue(formatValue);
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
  const [currencyValue, setCurrencyValue] = useState('');
  const [priceValue, setPriceValue] = useState(0);
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

          <Price>
            <label htmlFor='price'>Price</label>
            <span>{currencyValue}</span>
            <input
              id='price'
              value={priceValue}
              type='text'
              maxLength={10}
              {...register('price', {
                required: 'Price is requierd',
                onChange: onPriceData,
              })}
            />
          </Price>

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

          <CategoryBlock register={register} />
        </form>
      </Right>
    </Modal>
  );
}

export default UploadPost;
