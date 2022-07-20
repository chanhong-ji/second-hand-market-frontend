import { gql, useMutation } from '@apollo/client';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import { createPost, createPostVariables } from '../__generated__/createPost';
import { useNavigate } from 'react-router-dom';
import GetMeUser from '../hooks/getMeUser';
import { getFormatValue } from '../shared/utils';
import CategoryBlock from '../components/CategoryBlock';
import Preview from '../components/Preview';

const Title = styled.div``;
const Price = styled.div``;
const Explanation = styled.div``;
const Form = styled.div`
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
  const onFormInvalid: SubmitErrorHandler<createPostVariables> = ({
    title,
    caption,
    categoryName,
  }) => {
    if (title?.message) {
      alert(title.message);
      return;
    } else if (caption?.message) {
      alert(caption.message);
    } else if (categoryName?.message) {
      alert(categoryName.message);
    }
  };

  const onFormValid: SubmitHandler<createPostVariables> = async ({
    title,
    caption,
    price,
    categoryName,
  }) => {
    if (loading) return;
    const li = await Promise.all(
      photoUrls.map((url) => fetch(url).then((r) => r.blob()))
    );
    createPost({
      variables: { title, caption, categoryName, photos: li, price: +price },
    });
  };

  const onUploadCompleted = (data: createPost) => {
    const {
      createPost: { ok },
    } = data;
    if (!ok) return alert('fail');
    navigate(`/profiles/${meData?.me?.id}`);
  };

  const onPriceDataChanged = (data: any) => {
    const value = +String(data.target.value).replaceAll(/\D/g, '') ?? 0;
    setPriceValue(value);
    const formatValue = getFormatValue(value);
    setCurrencyValue(formatValue);
  };

  const [createPost, { loading }] = useMutation<
    createPost,
    createPostVariables
  >(CREATE_POST_MUTATION, { onCompleted: onUploadCompleted });
  const { register, handleSubmit, setValue } = useForm<
    createPostVariables & IUploadForm
  >();
  const navigate = useNavigate();
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [currencyValue, setCurrencyValue] = useState('');
  const [priceValue, setPriceValue] = useState(0);
  const meData = GetMeUser();

  return (
    <Modal
      title='Upload'
      completeFn={handleSubmit(onFormValid, onFormInvalid)}
      styles={{ gridTemplateColumns: '3fr 2fr' }}
      loading={loading}
    >
      <Preview
        register={register}
        setValue={setValue}
        photoUrls={photoUrls}
        setPhotoUrls={setPhotoUrls}
      />
      <Form>
        <form onSubmit={handleSubmit(onFormValid, onFormInvalid)}>
          <Title>
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
          </Title>

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
                onChange: onPriceDataChanged,
              })}
            />
          </Price>

          <Explanation>
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
          </Explanation>

          <CategoryBlock register={register} />
        </form>
      </Form>
    </Modal>
  );
}

export default UploadPost;
