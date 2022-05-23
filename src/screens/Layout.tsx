import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';

const Wrapper = styled.div`
  position: relative;
  min-height: 100vh;
  padding-top: ${(props) => props.theme.size.header.height}px;
  background-color: ${(props) => props.theme.color.bg};
`;

const Main = styled.main``;

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
