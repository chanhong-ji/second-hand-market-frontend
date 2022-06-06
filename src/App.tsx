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

function App() {
  const LoggedIn = useReactiveVar(LoggedInVar);
  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider>
        <GlobalStyle />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Posts />} />
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
              <Route path='posts/:id' element={<Post />} />
              <Route path='posts/:id/edit' element={<EditPost />} />
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
