import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    accent: Theme.ColorVariant;
    base: Theme.ColorVariant;
    neutral: Theme.ColorVariant;
  }
}

declare namespace Theme {
  interface Theme {
    accent: ColorVariant;
    base: ColorVariant;
    neutral: ColorVariant;
  }

  type VariantChoices = keyof Theme;

  interface ColorVariant {
    bg: string;
    bgLight: string;
    bgOutline: string;
    fg: string;
    fgLight: string;
    border: string;
  }

  type ColorOptions = keyof ColorVariant;
}
