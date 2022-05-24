import { gql, useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ErrorMessage from '../components/ErrorMessage';
import {
  createAccount,
  createAccountVariables,
} from '../__generated__/createAccount';

export const AuthWrapper = styled.div`
  width: 500px;
  height: 600px;
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(p) => p.theme.color.form};
`;
export const AuthForm = styled.div`
  width: 80%;
  padding-top: 30px;
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

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($name: String!, $password: String!, $phone: Int!) {
    createAccount(name: $name, password: $password, phone: $phone) {
      ok
      error
    }
  }
`;

function SignUp() {
  const onCompleted = (data: createAccount) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok)
      return setError('result', { message: error?.split(':').pop()?.trim() });

    const { phone, password } = getValues();
    navigate('/login', { state: { phone, password } });
  };

  const onValid: SubmitHandler<createAccountVariables & IForm> = ({
    phone,
    name,
    password,
    passwordConfirm,
  }) => {
    if (loading) return;
    if (password !== passwordConfirm)
      return setError(
        'password',
        { message: 'Password confirm wrong' },
        {
          shouldFocus: true,
        }
      );
    createAccount({ variables: { phone: +phone, name, password } });
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
    getValues,
  } = useForm<createAccountVariables & IForm>({ mode: 'onChange' });

  const [createAccount, { loading }] = useMutation<
    createAccount,
    createAccountVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  return (
    <AuthWrapper>
      <AuthForm onSubmit={handleSubmit(onValid)}>
        <Input
          {...register('phone', { required: 'phone is required' })}
          placeholder='phone'
          type='number'
          onClick={() => clearErrors()}
        />
        {errors?.phone?.message && (
          <ErrorMessage message={errors.phone.message || ''} />
        )}

        <Input
          {...register('name', { required: 'name is required' })}
          placeholder='name'
          type='text'
          onClick={() => clearErrors()}
        />
        {errors?.name?.message && (
          <ErrorMessage message={errors.name.message || ''} />
        )}
        <Input
          {...register('password', { required: 'password is required' })}
          type='password'
          placeholder='password'
          onClick={() => clearErrors()}
        />
        {errors?.password?.message && (
          <ErrorMessage message={errors.password.message || ''} />
        )}
        <Input
          {...register('passwordConfirm', {
            required: 'passwordConfirm is required',
          })}
          type='password'
          placeholder='passwordConfirm'
          onClick={() => clearErrors()}
        />
        {errors?.passwordConfirm?.message && (
          <ErrorMessage message={errors.passwordConfirm.message || ''} />
        )}
        <Input
          type='submit'
          value='Sign up'
          onClick={handleSubmit(onValid)}
          disabled={!isValid}
        />
        {errors?.result?.message && (
          <ErrorMessage message={errors.result.message || ''} />
        )}
      </AuthForm>
    </AuthWrapper>
  );
}

export default SignUp;
