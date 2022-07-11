import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';

const Wrapper = styled.div`
  position: relative;
  padding-top: ${(props) => props.theme.size.header.height};
`;

const Main = styled.main`
  width: ${(p) => p.theme.size.main.width};
  margin: 0 auto;
  padding-bottom: 30px;
  min-width: 350px;
  max-width: 900px;
`;

function Layout() {
  return (
    <Wrapper>
      <Header></Header>
      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  );
}

export default Layout;
