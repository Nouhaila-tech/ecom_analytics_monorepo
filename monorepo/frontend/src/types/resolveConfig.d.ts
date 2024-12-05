declare module 'tailwindcss/resolveConfig' {
    import { Config } from 'tailwindcss';
  
    export default function resolveConfig(config: Config): Config;
  }
  