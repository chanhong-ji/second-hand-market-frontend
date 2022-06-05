import { gql, useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUserLogin, zoneIdVar } from '../apollo';
import ErrorMessage from '../components/ErrorMessage';
import GetMeUser from '../hooks/getMeUser';
import { login, loginVariables } from '../__generated__/login';
import { AuthForm, AuthWrapper } from './SignUp';

const Input = styled.input`
  border: none;
  background-color: ${(p) => p.theme.color.input};
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
`;

interface IForm {
  result: string;
}

const LOGIN_MUTATION = gql`
  mutation login($phone: Int!, $password: String!) {
    login(phone: $phone, password: $password) {
      ok
      error
      token
    }
  }
`;

function Login() {
  const onValid: SubmitHandler<loginVariables & IForm> = ({
    phone,
    password,
  }) => {
    if (loading) return;
    login({ variables: { phone: +phone, password } });
  };
  const onCompleted = async ({ login }: login) => {
    const { ok, error, token } = login;
    if (!ok)
      return setError('result', { message: error?.split(':').pop()?.trim() });
    await getUserLogin(token || '');
    const meData = await GetMeUser();
    zoneIdVar(meData?.me?.zone?.id);
    navigate('/');
  };

  const navigate = useNavigate();
  const location: any = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm<loginVariables & IForm>({
    mode: 'onChange',
    defaultValues: {
      phone: location?.state?.phone,
      password: location?.state?.password,
    },
  });
  const [login, { loading }] = useMutation<login, loginVariables>(
    LOGIN_MUTATION,
    {
      onCompleted,
    }
  );

  return (
    <AuthWrapper>
      <AuthForm onSubmit={handleSubmit(onValid)}>
        <Input
          placeholder='phone number'
          type='number'
          {...register('phone', { required: 'phone is required' })}
          onClick={() => clearErrors()}
        />
        {errors.phone?.message && (
          <ErrorMessage message={errors.phone.message || ''} />
        )}
        <Input
          placeholder='password'
          type='password'
          {...register('password', { required: 'password is required' })}
          onClick={() => clearErrors()}
        />
        {errors.password?.message && (
          <ErrorMessage message={errors.password.message || ''} />
        )}
        <Input
          type='submit'
          disabled={!isValid}
          onClick={handleSubmit(onValid)}
        />
        {errors.result?.message && (
          <ErrorMessage message={errors.result.message || ''} />
        )}
      </AuthForm>
    </AuthWrapper>
  );
}

export default Login;