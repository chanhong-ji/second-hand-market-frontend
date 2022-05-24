import { gql, useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ErrorMessage from '../components/ErrorMessage';
import {
  createAccount,
  createAccountVariables,
} from '../__generated__/createAccount';

const Wrapper = styled.div`
  width: 500px;
  height: 600px;
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(p) => p.theme.color.form};
`;
const Form = styled.div`
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

interface IInput {
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
    navigate('/signup', { state: { phone, password } });
  };

  const onValid: SubmitHandler<createAccountVariables & IInput> = ({
    phone,
    name,
    password,
    passwordConfirm,
  }) => {
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
  } = useForm<createAccountVariables & IInput>({ mode: 'onChange' });

  const [createAccount, { loading }] = useMutation<
    createAccount,
    createAccountVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit(onValid)}>
        <Input
          {...register('phone', { required: 'phone is required' })}
          placeholder='phone'
          type='number'
          onClick={() => clearErrors()}
        />

        <Input
          {...register('name', { required: 'name is required' })}
          placeholder='name'
          type='text'
          onClick={() => clearErrors()}
        />
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
        {errors?.result?.message && (
          <ErrorMessage message={errors.result.message || ''} />
        )}
        <Input
          type='submit'
          value='Sign up'
          onClick={handleSubmit(onValid)}
          disabled={!isValid || loading}
        />
      </Form>
    </Wrapper>
  );
}

export default SignUp;
