import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { reset } from 'styled-reset';

export const theme: DefaultTheme = {
  color: {
    bg: {
      layout: 'whitesmoke',
    },
    header: 'grey',
    input: 'rgba(0, 0, 0, 0.3)',
    form: 'rgba(0, 0, 0, 0.2)',
  },
  size: {
    header: {
      height: '80px',
      padding: '20px',
    },
    main: { width: '60%' },
  },
};

export const GlobalStyle = createGlobalStyle`
 * {
   box-sizing: border-box
 }
 ${reset}
`;
