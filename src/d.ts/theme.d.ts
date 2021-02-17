export namespace Theme {
  interface Theme {
    accent: ColorVariant
    base: ColorVariant
    neutral: ColorVariant
  }

  type VariantChoices = keyof Theme

  interface ColorVariant {
    bg: string
    bgLight: string
    bgOutline: string
    fg: string
    fgLight: string
    border: string
  }

  type ColorOptions = keyof ColorVariant
}
