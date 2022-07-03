import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import {
  AuthForm,
  AuthWrapper,
  FormTitle,
  IForm,
  Input,
} from '../shared/shared';
import ZoneBlock from '../components/ZoneBlock';
import GetMeUser from '../hooks/getMeUser';
import {
  editProfile,
  editProfileVariables,
} from '../__generated__/editProfile';

const EDIT_PROFILE = gql`
  mutation editProfile(
    $name: String
    $password: String
    $avatar: Upload
    $zoneFirst: Int!
    $zoneSecond: Int!
  ) {
    editProfile(
      name: $name
      password: $password
      avatar: $avatar
      zoneFirst: $zoneFirst
      zoneSecond: $zoneSecond
    ) {
      ok
      error
    }
  }
`;

function EditProfile() {
  const onCompleted = (data: editProfile) => {
    const { ok } = data.editProfile;
    if (!ok) {
      alert('error');
    }
    alert('success');
    navigate(`/profiles/${id}`);
    window.location.reload();
  };

  const onValid = ({
    name,
    avatar,
    password,
    passwordConfirm,
    zoneFirst,
    zoneSecond,
  }: editProfileVariables & IForm) => {
    if (loading) return;
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
        zoneFirst: +zoneFirst,
        zoneSecond: +zoneSecond,
      },
    });
  };

  const { id } = useParams();
  const meData = GetMeUser();
  const navigate = useNavigate();

  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE, { onCompleted });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<editProfileVariables & IForm>({ mode: 'onChange' });

  useEffect(() => {
    if (meData?.me?.id != id) {
      navigate(-1);
    }
  }, [id]);
  return (
    <AuthWrapper>
      <AuthForm onSubmit={handleSubmit(onValid)}>
        <FormTitle>Edit Profile</FormTitle>
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
        <ZoneBlock register={register} />
        <label htmlFor='avatar'>Avatar</label>
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
