import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';

const Wrapper = styled.div`
  position: relative;
  min-height: 100vh;
  padding-top: ${(props) => props.theme.size.header.height};
  background-color: ${(props) => props.theme.color.bg.layout};
`;

const Main = styled.main`
  width: ${(p) => p.theme.size.main.width};
  margin: 0 auto;
  min-width: 400px;
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
