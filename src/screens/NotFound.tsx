import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 20px;
  div {
    font-size: 30px;
    font-weight: 600;
  }
`;

function NotFound({ children }: any) {
  return (
    <Wrapper>
      <div>Not Found</div>
      {children && <span>{children}</span>}
    </Wrapper>
  );
}

export default NotFound;
