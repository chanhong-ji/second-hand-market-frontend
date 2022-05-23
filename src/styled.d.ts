import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: {
      bg: string;
      header: string;
    };
    size: {
      header: {
        height: string;
        padding: string;
      };
    };
  }
}
