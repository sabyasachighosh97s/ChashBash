import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

import colors from './colors';

export const lightTheme = {
  ...MD3LightTheme,

  dark: false,

  colors: {
    ...MD3LightTheme.colors,

    primary: colors.primary,

    secondary: colors.secondary,

    background: colors.background,

    surface: colors.surface,

    card: colors.card,

    text: colors.text,

    subText: colors.subText,

    border: colors.border,

    glass: colors.glass,

    glassBorder: colors.glassBorder,

    weatherCard: colors.weatherCard,

    weatherOverlay: colors.weatherOverlay,

    bottomBar: colors.bottomBar,

    accent: colors.accent,

    success: colors.success,

    warning: colors.warning,

    info: colors.info,

    error: colors.error,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,

  dark: true,

  colors: {
    ...MD3DarkTheme.colors,

    /*
    =====================================
    BRAND
    =====================================
    */

    primary: '#4ADE80',

    secondary: '#60A5FA',

    accent: '#A4E45F',

    /*
    =====================================
    BACKGROUND
    =====================================
    */

    background: '#0B1220',

    surface: '#131C2E',

    card: '#182235',

    /*
    =====================================
    TEXT
    =====================================
    */

    text: '#F8FAFC',

    subText: '#94A3B8',

    /*
    =====================================
    BORDER
    =====================================
    */

    border: 'rgba(255,255,255,0.08)',

    /*
    =====================================
    GLASS
    =====================================
    */

    glass: 'rgba(255,255,255,0.06)',

    glassBorder: 'rgba(255,255,255,0.08)',

    /*
    =====================================
    WEATHER
    =====================================
    */

    weatherCard: 'rgba(255,255,255,0.06)',

    weatherOverlay: 'rgba(255,255,255,0.04)',

    /*
    =====================================
    BOTTOM TAB
    =====================================
    */

    bottomBar: '#111827',

    /*
    =====================================
    STATUS
    =====================================
    */

    success: '#4ADE80',

    warning: '#FBBF24',

    info: '#60A5FA',

    error: '#F87171',
  },
};

export default lightTheme;
