import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { reset } from 'styled-reset';

export const theme: DefaultTheme = {
  color: {
    bg: {
      layout: 'whitesmoke',
      main: 'white',
    },
    header: {
      input: 'white',
    },
    input: 'rgba(0, 0, 0, 0.3)',
    form: 'rgba(0, 0, 0, 0.2)',
    border: 'rgba(0, 0, 0, 0.1)',
    accent: 'tomato',
    font: {
      exp: 'rgba(0, 0, 0, 0.7)',
    },
  },
  size: {
    header: {
      height: '80px',
      padding: '17px',
    },
    main: { width: '50%' },
    arrow: '20px',
  },
};

export const GlobalStyle = createGlobalStyle`
 * {
   box-sizing: border-box;
   text-decoration: none;
 }
 ${reset}
`;
