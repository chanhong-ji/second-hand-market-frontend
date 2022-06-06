import styled from 'styled-components';

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
export const AuthForm = styled.form`
  width: 80%;
  padding-top: 30px;
`;
export const Input = styled.input`
  border: none;
  background-color: ${(p) => p.theme.color.input};
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
`;
export const SubmitInput = styled(Input)`
  cursor: pointer;
`;
export const Zone = styled.div``;

export interface IForm {
  passwordConfirm: string;
  result: string;
  first: string;
  second: string;
}
