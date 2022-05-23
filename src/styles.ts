import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { reset } from 'styled-reset';

export const theme: DefaultTheme = {
  color: {
    bg: 'whitesmoke',
    header: 'grey',
  },
  size: {
    header: {
      height: '80px',
      padding: '20px',
    },
  },
};

export const GlobalStyle = createGlobalStyle`
 * {
   box-sizing: border-box
 }
 ${reset}
`;
