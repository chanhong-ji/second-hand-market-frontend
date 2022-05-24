import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: {
      bg: {
        layout: string;
      };
      header: string;
      input: string;
      form: string;
    };
    size: {
      header: {
        height: string;
        padding: string;
      };
      main: {
        width: string;
      };
    };
  }
}
