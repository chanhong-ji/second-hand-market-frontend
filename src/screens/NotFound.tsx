import styled from 'styled-components';
import PageTitle from '../components/PageTitle';

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
      <PageTitle title='Not Found' />
      <div>Not Found</div>
      {children && <span>{children}</span>}
    </Wrapper>
  );
}

export default NotFound;
