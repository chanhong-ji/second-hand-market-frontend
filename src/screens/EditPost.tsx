import { ApolloCache, FetchResult, gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CategoryBlock from '../components/CategoryBlock';
import Modal from '../components/Modal';
import PageTitle from '../components/PageTitle';
import { IForm } from '../shared/components';
import { getFormatValue } from '../shared/utils';
import { editPost, editPostVariables } from '../__generated__/editPost';

const Left = styled.div<{ url: string | null }>`
  background-image: ${(p) => (p.url ? `url('${p.url}')` : 'none')};
  background-color: whitesmoke;
  border-bottom-left-radius: 20px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  height: 100%;
`;
const Title = styled.div``;
const Price = styled.div``;
const Exp = styled.div``;
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
        height: 15px;
        margin-top: 10px;
        font-size: 18px;
      }
      input {
        margin-top: 15px;
        border: none;
        border-bottom: 1px solid black;
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

const EDIT_POST_MUTATION = gql`
  mutation editPost(
    $id: Int!
    $title: String
    $price: Int
    $caption: String
    $categoryName: String
  ) {
    editPost(
      id: $id
      title: $title
      price: $price
      caption: $caption
      categoryName: $categoryName
    ) {
      ok
      error
      id
    }
  }
`;

function EditPost() {
  const onFormInvalid: SubmitErrorHandler<editPostVariables & IForm> = ({
    title,
    caption,
    categoryName,
  }) => {
    if (title?.message) {
      alert(title?.message);
      return;
    }
    if (caption?.message) {
      alert(caption?.message);
      return;
    }
    if (categoryName?.message) {
      alert(categoryName.message);
    }
  };

  const onFormValid: SubmitHandler<editPostVariables> = ({
    title,
    caption,
    price,
    categoryName,
  }) => {
    if (loading || !isValid) return;

    editPost({
      variables: {
        id: location.state?.postId,
        title,
        caption,
        ...(price && { price: +price }),
        categoryName,
      },
    });
  };

  const onEditCompleted = (data: editPost) => {
    const { ok, error } = data.editPost;
    if (!ok) {
      return alert(error);
    }
    alert('Success to edit post');
    navigate(`/posts/${location.state.postId}`);
  };

  const onPriceChanged = (data: any) => {
    const value = +String(data.target.value).replaceAll(/\D/g, '') ?? 0;
    setPriceValue(value);
    const formatValue = getFormatValue(value);
    setCurrencyValue(formatValue);
  };

  const onUpdateEdit = (
    cache: ApolloCache<any>,
    result: Omit<
      FetchResult<editPost, Record<string, any>, Record<string, any>>,
      'context'
    >
  ) => {
    if (!result.data?.editPost) return;
    if (result.data.editPost.ok === false) {
      return alert(result.data.editPost.error);
    }

    const { title, price, caption, categoryName } = getValues();
    cache.modify({
      id: `Post:${result.data.editPost.id}`,
      fields: {
        ...(title && {
          title: () => title,
        }),

        ...(price && {
          price: () => +price,
        }),

        ...(caption && {
          caption: () => caption,
        }),

        ...(categoryName && {
          categoryName: () => categoryName,
        }),
      },
    });
  };

  const location: any = useLocation();
  const navigate = useNavigate();
  const [currencyValue, setCurrencyValue] = useState('');
  const [priceValue, setPriceValue] = useState(location.state?.price);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
  } = useForm<editPostVariables & IForm>({
    defaultValues: {
      title: location.state?.title,
      caption: location.state?.caption,
    },
  });

  const [editPost, { loading }] = useMutation<editPost, editPostVariables>(
    EDIT_POST_MUTATION,
    {
      onCompleted: onEditCompleted,
      update: onUpdateEdit,
    }
  );

  useEffect(() => {
    if (location.state === null || !!!location.state?.isMine) {
      alert('Wrong access');
      navigate('/', { replace: true });
    }
  }, []);

  return (
    <Modal
      title='Edit'
      completeFn={handleSubmit(onFormValid, onFormInvalid)}
      styles={{ gridTemplateColumns: '3fr 2fr' }}
      loading={loading}
    >
      <PageTitle title='Edit' />
      <Left url={location.state?.photoUrl || null}></Left>
      <Right>
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
                onChange: onPriceChanged,
              })}
            />
          </Price>

          <Exp>
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
          </Exp>

          <CategoryBlock
            register={register}
            defaultValue={location.state?.categoryName}
          />
        </form>
      </Right>
    </Modal>
  );
}

export default EditPost;
