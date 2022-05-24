import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { LoggedInVar } from './apollo';
import Home from './screens/Home';
import Layout from './screens/Layout';
import SignUp from './screens/SignUp';
import { GlobalStyle, theme } from './styles';

function App() {
  const LoggedIn = useReactiveVar(LoggedInVar);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path='/signup'
              element={
                LoggedIn ? <Navigate to='/' replace={true} /> : <SignUp />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
