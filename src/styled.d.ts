import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: {
      bg: {
        layout: string;
      };
      input: string;
      form: string;
      border: string;
      accent: string;
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
