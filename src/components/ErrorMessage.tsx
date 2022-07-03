import styled from 'styled-components';

const Div = styled.div`
  color: ${(p) => p.theme.color.accent};
  font-size: 14px;
  font-weight: 600;
  margin-top: 5px;
  text-align: center;
`;

function ErrorMessage({ message }: { message: string | undefined }) {
  return message == undefined ? null : <Div>{message}</Div>;
}

export default ErrorMessage;
