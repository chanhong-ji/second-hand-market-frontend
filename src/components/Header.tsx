import { useReactiveVar } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUserLogout, LoggedInVar } from '../apollo';
import getMeUser from '../hooks/getMeUser';
import Avatar from './Avatar';
import SearchBar from './SearchBar';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${(props) => props.theme.size.header.height};
  background-color: ${(props) => props.theme.color.bg.layout};
  padding: ${(props) => props.theme.size.header.padding};
  border-bottom: 2px solid ${(p) => p.theme.color.border};
  z-index: 2;
  display: flex;
  justify-content: space-between;
`;

const ColumnBase = styled.div`
  display: flex;
  align-items: center;
`;
const ColumnForMobile = styled(ColumnBase)`
  &:first-child {
    color: rgba(0, 0, 0, 0.7);
    margin-right: 20px;
  }
  &:nth-child(2) {
    flex-grow: 1;
  }
  &:last-child {
    margin-left: 20px;
    cursor: pointer;
  }
`;

const Column = styled(ColumnBase)`
  :first-child {
    margin-right: 20px;
  }
  :nth-child(2) {
    width: 700px;
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
  white-space: nowrap;
`;

function Header() {
  const navigate = useNavigate();
  const meData = getMeUser();
  const loggedIn = useReactiveVar(LoggedInVar);
  // const isDesktop = useMediaQuery({ minWidth: 992 });
  // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  // const isNotMobile = useMediaQuery({ minWidth: 768 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <Wrapper>
      {isMobile ? (
        <>
          <ColumnForMobile>
            <Item onClick={() => navigate('/')}>
              <FontAwesomeIcon icon={faHome} size='lg' />
            </Item>
          </ColumnForMobile>
          <ColumnForMobile>
            <SearchBar />
          </ColumnForMobile>
          <ColumnForMobile>
            <FontAwesomeIcon icon={faBars} size='lg' />
          </ColumnForMobile>
        </>
      ) : (
        <>
          <Column>
            <Item onClick={() => navigate('/')}>당큰 마켓</Item>
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
              <Avatar
                size={40}
                url={meData?.me?.avatar || ''}
                onClick={() => navigate(`/profiles/${meData?.me?.id}`)}
              />
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
        </>
      )}
    </Wrapper>
  );
}

export default Header;
