import { useReactiveVar } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUserLogout, LoggedInVar } from '../apollo';
import getMeUser from '../hooks/getMeUser';

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${(props) => props.theme.size.header.height};
  background-color: ${(props) => props.theme.color.header};
  padding: ${(props) => props.theme.size.header.padding};

  display: flex;
  justify-content: space-between;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  :last-child {
    div {
      margin-left: 20px;
    }
  }
`;
const Item = styled.div`
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
      {loggedIn ? (
        <Column>
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
