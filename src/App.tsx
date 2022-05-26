import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { LoggedInVar } from './apollo';
import Home from './screens/Home';
import Layout from './screens/Layout';
import SignUp from './screens/SignUp';
import { GlobalStyle, theme } from './styles';
import Login from './screens/Login';
import Profile from './screens/Profile';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  const LoggedIn = useReactiveVar(LoggedInVar);
  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider>
        <GlobalStyle />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
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
              <Route path='profile/:id' element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
