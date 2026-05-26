// utils/dimensions.ts
import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

const scale = width / 375; // base iPhone 6 width

export const scaleSize = (size: number) => scale * size;
export const scaleFont = (size: number) => size * PixelRatio.getFontScale();
