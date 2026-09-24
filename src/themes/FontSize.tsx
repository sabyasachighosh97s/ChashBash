// src/themes/fontSize.ts

const fontSize = {
  xs: 12,
  sm: 14,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  mxl: 25,
  xxl: 30,
  xxxl: 35,
} as const;

export type FontSizeKey = keyof typeof fontSize;

export default fontSize;
