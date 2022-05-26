import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { reset } from 'styled-reset';

export const theme: DefaultTheme = {
  color: {
    bg: {
      layout: 'whitesmoke',
    },
    input: 'rgba(0, 0, 0, 0.3)',
    form: 'rgba(0, 0, 0, 0.2)',
    border: 'rgba(0, 0, 0, 0.1)',
    accent: 'tomato',
  },
  size: {
    header: {
      height: '80px',
      padding: '20px',
    },
    main: { width: '50%' },
  },
};

export const GlobalStyle = createGlobalStyle`
 * {
   box-sizing: border-box
 }
 ${reset}
`;
