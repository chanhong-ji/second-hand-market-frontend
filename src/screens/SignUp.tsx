import { gql, useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import {
  AuthForm,
  AuthWrapper,
  FormTitle,
  IFormWithPasswordConfirm,
  Input,
} from '../shared/components';
import ZoneBlock from '../components/ZoneBlock';
import {
  createAccount,
  createAccountVariables,
} from '../__generated__/createAccount';
import PageTitle from '../components/PageTitle';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $name: String!
    $password: String!
    $phone: String!
    $zoneFirst: Int!
    $zoneSecond: Int!
  ) {
    createAccount(
      name: $name
      password: $password
      phone: $phone
      zoneFirst: $zoneFirst
      zoneSecond: $zoneSecond
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const onFormValid: SubmitHandler<
    createAccountVariables & IFormWithPasswordConfirm
  > = ({ phone, name, password, passwordConfirm, zoneFirst, zoneSecond }) => {
    if (loading) return;
    if (password !== passwordConfirm)
      return setError(
        'password',
        { message: 'Password confirm wrong' },
        {
          shouldFocus: true,
        }
      );
    createAccount({
      variables: {
        phone,
        name,
        password,
        zoneFirst: +zoneFirst,
        zoneSecond: +zoneSecond,
      },
    });
  };

  const onSignUpCompleted = (data: createAccount) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok)
      return setError('result', { message: error?.split(':').pop()?.trim() });

    const { phone, password } = getValues();
    navigate('/login', { state: { phone, password } });
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
    getValues,
  } = useForm<createAccountVariables & IFormWithPasswordConfirm>({
    mode: 'onChange',
  });
  const [createAccount, { loading }] = useMutation<
    createAccount,
    createAccountVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted: onSignUpCompleted,
  });

  return (
    <AuthWrapper>
      <PageTitle title='Sign up' />
      <AuthForm onSubmit={handleSubmit(onFormValid)}>
        <FormTitle>Sign up</FormTitle>
        <label htmlFor='phone'>Phone number</label>
        <Input
          id='phone'
          {...register('phone', { required: 'phone is required' })}
          type='string'
          onClick={() => clearErrors()}
        />
        <ErrorMessage message={errors.phone?.message} />

        <label htmlFor='name'>Name</label>
        <Input
          id='name'
          {...register('name', { required: 'name is required' })}
          type='text'
          onClick={() => clearErrors()}
        />
        <ErrorMessage message={errors.name?.message} />

        <ZoneBlock register={register} />

        <label htmlFor='password'>Password</label>
        <Input
          id='password'
          {...register('password', { required: 'password is required' })}
          type='password'
          onClick={() => clearErrors()}
        />
        <ErrorMessage message={errors.password?.message || ''} />

        <label htmlFor='passwordConfirm'>Password Confirm</label>
        <Input
          id='passwordConfirm'
          {...register('passwordConfirm', {
            required: 'passwordConfirm is required',
          })}
          type='password'
          onClick={() => clearErrors()}
        />
        <ErrorMessage message={errors.passwordConfirm?.message} />

        <Input
          type='submit'
          value='Sign up'
          onClick={handleSubmit(onFormValid)}
          disabled={!isValid}
        />
        <ErrorMessage message={errors.result?.message} />
      </AuthForm>
    </AuthWrapper>
  );
}

export default SignUp;
