import React from 'react';

import {
  StatusBar,
  View,
  Platform,
  StatusBarStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from 'react-native-paper';

type CustomStatusBarProps = {
  backgroundColor?: string;
  barStyle?: StatusBarStyle;
  translucent?: boolean;
};

export const CustomStatusBar = ({
  backgroundColor,
  barStyle,
  translucent = true,
}: CustomStatusBarProps) => {
  const insets = useSafeAreaInsets();

  const theme = useTheme();

  const isDark = theme.dark;

  const statusBarStyle =
    barStyle ||
    (isDark
      ? 'light-content'
      : 'dark-content');

  const bgColor =
    backgroundColor ||
    theme.colors.background;

  return (
    <>
      <StatusBar
        backgroundColor={
          translucent
            ? 'transparent'
            : bgColor
        }
        barStyle={statusBarStyle}
        translucent={translucent}
        animated
      />

      {Platform.OS === 'ios' &&
        translucent && (
          <View
            style={{
              height: insets.top,
              backgroundColor: bgColor,
            }}
          />
        )}
    </>
  );
};