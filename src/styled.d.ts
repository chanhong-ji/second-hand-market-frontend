import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: {
      bg: {
        layout: string;
        main: string;
      };
      header: {
        input: string;
      };
      input: string;
      form: string;
      border: string;
      accent: string;
      blue: string;
      main: string;
      font: {
        exp: string;
      };
    };
    size: {
      header: {
        height: string;
        padding: string;
      };
      main: {
        width: string;
      };
      arrow: string;
      room: {
        height: {
          whole: string;
          talkingTo: string;
          postInfo: string;
          chat: string;
        };
      };
    };
  }
}
