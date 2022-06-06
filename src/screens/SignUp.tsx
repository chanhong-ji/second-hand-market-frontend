import { gql, useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import {
  AuthForm,
  AuthWrapper,
  IForm,
  Input,
  Zone,
} from '../components/shared';
import ZoneBlock from '../components/ZoneBlock';
import {
  createAccount,
  createAccountVariables,
} from '../__generated__/createAccount';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $name: String!
    $password: String!
    $phone: Int!
    $zoneId: Int!
  ) {
    createAccount(
      name: $name
      password: $password
      phone: $phone
      zoneId: $zoneId
    ) {
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
    first,
    second,
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
    const secondZoneCode = second.padStart(2, '0');
    const zoneId = +(first + secondZoneCode);
    createAccount({
      variables: { phone: +phone, name, password, zoneId },
    });
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
        <label htmlFor='phone'>Phone</label>
        <Input
          id='phone'
          {...register('phone', { required: 'phone is required' })}
          placeholder='phone'
          type='number'
          onClick={() => clearErrors()}
        />
        {errors?.phone?.message && (
          <ErrorMessage message={errors.phone.message || ''} />
        )}

        <label htmlFor='name'>Name</label>
        <Input
          id='name'
          {...register('name', { required: 'name is required' })}
          placeholder='name'
          type='text'
          onClick={() => clearErrors()}
        />
        {errors?.name?.message && (
          <ErrorMessage message={errors.name.message || ''} />
        )}

        <label htmlFor='zoneId'>Zone</label>

        <ZoneBlock register={register} clearErrors={clearErrors} />
        <label htmlFor='password'>Password</label>
        <Input
          id='password'
          {...register('password', { required: 'password is required' })}
          type='password'
          placeholder='password'
          onClick={() => clearErrors()}
        />
        {errors?.password?.message && (
          <ErrorMessage message={errors.password.message || ''} />
        )}

        <label htmlFor='passwordConfirm'>Password Confirm</label>
        <Input
          id='passwordConfirm'
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
