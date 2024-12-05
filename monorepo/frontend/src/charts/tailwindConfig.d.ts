declare module '@tailwindConfig' {
    export const theme: {
      colors: {
        gray: {
          [key: number]: string; 
          [key: string]: string;
        };
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
  