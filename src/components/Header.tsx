import { useReactiveVar } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUserLogout, LoggedInVar } from '../apollo';
import getMeUser from '../hooks/getMeUser';
import Avatar from './Avatar';
import SearchBar from './SearchBar';

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${(props) => props.theme.size.header.height};
  background-color: ${(props) => props.theme.color.bg.layout};
  padding: ${(props) => props.theme.size.header.padding};
  border-bottom: 2px solid ${(p) => p.theme.color.border};
  z-index: 1;
  display: flex;
  justify-content: space-between;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  :first-child {
    margin-right: 50px;
  }
  :nth-child(2) {
    width: 700px;
    min-width: 400px;
  }
  :last-child {
    * {
      margin-left: 20px;
    }
  }
`;
const Item = styled.div`
  cursor: pointer;
  font-size: 20px;
`;

function Header() {
  const navigate = useNavigate();
  const meData = getMeUser();
  const loggedIn = useReactiveVar(LoggedInVar);

  return (
    <Wrapper>
      <Column>
        <Item onClick={() => navigate('/')}>Home</Item>
      </Column>
      <Column>
        <SearchBar />
      </Column>
      {loggedIn ? (
        <Column>
          <Item>
            <Link to='room'>Chats</Link>
          </Item>
          <Item>
            <Link to='upload'>Upload</Link>
          </Item>
          <Avatar size={40} url={meData?.me?.avatar || ''} />
          <Item onClick={() => navigate(`/profiles/${meData?.me?.id}`)}>
            My Profile
          </Item>
          <Item onClick={getUserLogout}>Log out</Item>
        </Column>
      ) : (
        <Column>
          <Item onClick={() => navigate('/login')}>Login</Item>
          <Item onClick={() => navigate('/signup')}>Sign up</Item>
        </Column>
      )}
    </Wrapper>
  );
}

export default Header;
