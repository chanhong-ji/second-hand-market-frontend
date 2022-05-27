import { ApolloCache, gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ErrorMessage from '../components/ErrorMessage';
import GetMeUser from '../hooks/getMeUser';
import {
  editProfile,
  editProfileVariables,
} from '../__generated__/editProfile';
import { AuthForm, AuthWrapper } from './SignUp';

const EDIT_PROFILE = gql`
  mutation editProfile($name: String, $password: String, $avatar: Upload) {
    editProfile(name: $name, password: $password, avatar: $avatar) {
      ok
      error
    }
  }
`;

const Input = styled.input`
  border: none;
  background-color: ${(p) => p.theme.color.input};
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
`;

interface IForm {
  passwordConfirm: string;
  result: string;
}

function EditProfile() {
  const onUpdateProfile = (cache: ApolloCache<any>, { data }: any) => {
    const { ok, error } = data.editProfile;
    if (!ok) {
      alert('error');
    }

    const { name, avatar } = getValues();
    cache.modify({
      id: `User:${id}`,
      fields: {
        ...(name && { name: () => name }),
      },
    });
    alert('success');
    navigate(`/profile/${id}`);
  };

  const onValid = ({
    name,
    avatar,
    password,
    passwordConfirm,
  }: editProfileVariables & IForm) => {
    if (password !== passwordConfirm)
      return setError(
        'password',
        { message: 'Password confirm wrong' },
        { shouldFocus: true }
      );
    editProfile({
      variables: {
        name,
        ...(avatar.length > 0 && { avatar: avatar[0] }),
        password,
      },
    });
  };

  const { id } = useParams();
  const meData = GetMeUser();
  const navigate = useNavigate();
  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE, { update: onUpdateProfile });
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isValid },
  } = useForm<editProfileVariables & IForm>({ mode: 'onChange' });

  useEffect(() => {
    if (meData?.me?.id != id) {
      navigate(-1);
    }
  }, [id]);
  return (
    <AuthWrapper>
      <AuthForm onSubmit={handleSubmit(onValid)}>
        <label htmlFor='name'>Username</label>
        <Input
          id='name'
          placeholder='name'
          {...register('name')}
          defaultValue={meData?.me?.name}
        />
        <label htmlFor='password'>Password</label>
        <Input id='password' placeholder='password' {...register('password')} />
        <ErrorMessage message={errors.password?.message} />
        <label htmlFor='passwordConfirm'>Password Confirm</label>{' '}
        <Input
          id='passwordConfirm'
          placeholder='passwordConfirm'
          {...register('passwordConfirm')}
        />
        <label htmlFor='avatar'>avatar</label>
        <Input
          id='avatar'
          placeholder='avatar'
          {...register('avatar')}
          type='file'
        />
        <Input type='submit' value='Save' onClick={handleSubmit(onValid)} />
      </AuthForm>
    </AuthWrapper>
  );
}

export default EditProfile;
