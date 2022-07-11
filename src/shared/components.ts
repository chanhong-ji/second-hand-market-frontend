import styled from 'styled-components';

export const AuthWrapper = styled.div`
  width: 500px;
  height: 600px;
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

export const AuthForm = styled.form`
  width: 80%;
  padding-top: 30px;
  label {
    display: block;
    &:not(:first-child) {
      margin-top: 20px;
    }
  }
`;

export const FormTitle = styled.div`
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: center;
`;

export const Input = styled.input`
  border: none;
  background-color: ${(p) => p.theme.color.input};
  width: 100%;
  height: 50px;
  margin-top: 7px;
  padding-left: 5px;
  border-radius: 3px;
  font-size: 17px;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.1) 0px 0px 0px 1px;
  &[type='submit'] {
    background-color: ${(p) => p.theme.color.blue};
    color: white;
  }
`;

export const SubmitInput = styled(Input)`
  cursor: pointer;
`;

export const PostsWrapper = styled.div`
  background-color: ${(p) => p.theme.color.bg.main};
  border: 1px solid ${(p) => p.theme.color.border};
  border-radius: 10px;
  margin-top: 40px;
  width: 100%;
  min-height: 300px;
  position: relative;
  padding-bottom: 60px;
`;

//interface
export interface IForm {
  result: string;
}

export interface IFormWithPasswordConfirm extends IForm {
  passwordConfirm: string;
}
