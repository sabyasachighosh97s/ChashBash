import React from 'react';

import { Appbar, useTheme } from 'react-native-paper';

type CustomAppBarProps = {
  title: string;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  backgroundColor?: string;
};

export const CustomAppBar = ({
  title,
  onBackPress,
  onMenuPress,
  onSearchPress,
  backgroundColor,
}: CustomAppBarProps) => {
  const theme = useTheme();

  const isDark = theme.dark;

  return (
    <Appbar.Header
      style={{
        backgroundColor:
          backgroundColor ||
          'transparent',

        elevation: 0,
      }}
    >
      {onBackPress && (
        <Appbar.BackAction
          color={
            isDark ? '#fff' : '#000'
          }
          onPress={onBackPress}
        />
      )}

      <Appbar.Content
        title={title}
        titleStyle={{
          color:
            isDark ? '#fff' : '#000',

          fontSize: 20,
          fontWeight: '600',
        }}
      />

      {onSearchPress && (
        <Appbar.Action
          icon="magnify"
          color={
            isDark ? '#fff' : '#000'
          }
          onPress={onSearchPress}
        />
      )}

      {onMenuPress && (
        <Appbar.Action
          icon="menu"
          color={
            isDark ? '#fff' : '#000'
          }
          onPress={onMenuPress}
        />
      )}
    </Appbar.Header>
  );
};