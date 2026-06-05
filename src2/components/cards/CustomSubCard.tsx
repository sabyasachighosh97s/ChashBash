import React, { ReactNode } from 'react';

import { StyleSheet, ViewStyle, StyleProp } from 'react-native';

import { Card, useTheme } from 'react-native-paper';

type CustomSubCardProps = {
  children: ReactNode;

  style?: StyleProp<ViewStyle>;

  variant?: 'blue' | 'green';
};

export const CustomSubCard = ({
  children,
  style,
  variant = 'blue',
}: CustomSubCardProps) => {
  const theme = useTheme<any>();

  const isDark = theme.dark;

  const blueMode = {
    backgroundColor: isDark ? '#101A2B' : '#F4F7FF',

    borderColor: isDark ? '#243244' : '#DCE7FF',
  };

  const greenMode = {
    backgroundColor: isDark ? '#14211B' : '#F0FDF4',

    borderColor: isDark ? '#294236' : '#D7F5DD',
  };
  return (
    <Card
      mode="contained"
      style={[styles.card, variant === 'green' ? greenMode : blueMode, style]}
    >
      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '49%',

    borderRadius: 28,

    padding: 10,

    borderWidth: 1,

    elevation: 0,

    overflow: 'hidden',
  },
});
