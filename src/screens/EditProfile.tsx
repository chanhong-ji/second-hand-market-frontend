import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { AuthForm, AuthWrapper, IForm, Input } from '../components/shared';
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
    $zoneId: Int!
  ) {
    editProfile(
      name: $name
      password: $password
      avatar: $avatar
      zoneId: $zoneId
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
    first,
    second,
    password,
    passwordConfirm,
  }: editProfileVariables & IForm) => {
    if (password !== passwordConfirm)
      return setError(
        'password',
        { message: 'Password confirm wrong' },
        { shouldFocus: true }
      );
    const secondZoneCode = second.padStart(2, '0');
    const zoneId = +(first + secondZoneCode);
    editProfile({
      variables: {
        name,
        ...(avatar.length > 0 && { avatar: avatar[0] }),
        password,
        zoneId,
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
    formState: { errors, isValid },
    clearErrors,
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
        <ZoneBlock register={register} defaultValue={meData?.me?.zoneId + ''} />
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
