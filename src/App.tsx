import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { LoggedInVar } from './apollo';
import { HelmetProvider } from 'react-helmet-async';
import { GlobalStyle, theme } from './styles';
import Posts from './screens/Posts';
import Layout from './screens/Layout';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Profile from './screens/Profile';
import EditProfile from './screens/EditProfile';
import Post from './screens/Post';
import NotFound from './screens/NotFound';
import EditPost from './screens/EditPost';
import UploadPost from './screens/UploadPost';
import Search from './screens/Search';
import Rooms from './screens/Rooms';
import Room from './screens/Room';

function App() {
  const LoggedIn = useReactiveVar(LoggedInVar);
  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider>
        <GlobalStyle />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route path='/' element={<Posts />}>
                <Route path='upload' element={<UploadPost />} />
              </Route>
              <Route
                path='signup'
                element={
                  LoggedIn ? <Navigate to='/' replace={true} /> : <SignUp />
                }
              />
              <Route
                path='login'
                element={
                  LoggedIn ? <Navigate to='/' replace={true} /> : <Login />
                }
              />
              <Route path='profiles/:id' element={<Profile />} />
              <Route path='profiles/:id/edit' element={<EditProfile />} />
              <Route path='search' element={<Search />} />
              <Route path='posts/:id' element={<Post />}>
                <Route path='edit' element={<EditPost />} />
              </Route>
              <Route
                path='room'
                element={
                  LoggedIn ? <Rooms /> : <Navigate to='/' replace={true} />
                }
              >
                <Route path=':id' element={<Room />} />
              </Route>
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
