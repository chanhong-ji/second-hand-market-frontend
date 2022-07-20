import { gql, useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserLogin } from '../apollo';
import ErrorMessage from '../components/ErrorMessage';
import PageTitle from '../components/PageTitle';
import {
  AuthForm,
  AuthWrapper,
  FormTitle,
  IForm,
  Input,
} from '../shared/components';
import { login, loginVariables } from '../__generated__/login';

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
  const onFormValid: SubmitHandler<loginVariables & IForm> = ({
    phone,
    password,
  }) => {
    if (loading) return;
    login({ variables: { phone: +phone, password } });
  };

  const onLoginCompleted = async ({ login }: login) => {
    const { ok, error, token } = login;
    if (!ok || !token)
      return setError('result', { message: error?.split(':').pop()?.trim() });
    await getUserLogin(token);
    navigate('/');
  };

  const navigate = useNavigate();
  const { state }: any = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm<loginVariables & IForm>({
    mode: 'onChange',
    defaultValues: {
      phone: state?.phone,
      password: state?.password,
    },
  });
  const [login, { loading }] = useMutation<login, loginVariables>(
    LOGIN_MUTATION,
    { onCompleted: onLoginCompleted }
  );

  return (
    <AuthWrapper>
      <AuthForm onSubmit={handleSubmit(onFormValid)}>
        <PageTitle title='Login' />
        <FormTitle>Login</FormTitle>
        <Input
          placeholder='phone number'
          type='number'
          {...register('phone', { required: 'phone is required' })}
          onClick={() => clearErrors()}
        />
        <ErrorMessage message={errors.phone?.message} />
        <Input
          placeholder='password'
          type='password'
          {...register('password', { required: 'password is required' })}
          onClick={() => clearErrors()}
        />
        <ErrorMessage message={errors.password?.message} />
        <Input
          type='submit'
          disabled={!isValid}
          onClick={handleSubmit(onFormValid)}
          value='Login'
        />
        <ErrorMessage message={errors.result?.message} />
      </AuthForm>
    </AuthWrapper>
  );
}

export default Login;
