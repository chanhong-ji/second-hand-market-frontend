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
    input: 'white',
    form: 'rgba(0, 0, 0, 0.2)',
    border: 'rgba(0, 0, 0, 0.1)',
    accent: 'tomato',
    blue: '#1773ea',
    main: 'whitesmoke',
    font: {
      exp: 'rgba(0, 0, 0, 0.7)',
    },
  },
  size: {
    header: {
      height: '80px',
      padding: '17px',
    },
    main: { width: '90%' },
    arrow: '20px',
    room: {
      height: {
        whole: `${window.innerHeight - 140}px`,
        talkingTo: `70px`,
        postInfo: `50px`,
        chat: `${window.innerHeight - 260}px`,
      },
    },
  },
};

export const GlobalStyle = createGlobalStyle`
 * {
   box-sizing: border-box;
   text-decoration: none;
 }
 ${reset}
 body {
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  background-color: ${(props) => props.theme.color.bg.layout};
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  button {
    background: none;
    border: none;
  }
 }
`;
