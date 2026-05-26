import React, { ReactNode } from 'react';

import { StyleSheet, ViewStyle, StyleProp } from 'react-native';

import { Card, useTheme } from 'react-native-paper';

type CustomCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const CustomCard = ({ children, style }: CustomCardProps) => {
  const theme = useTheme<any>();
  const isDark = theme.dark;

  return (
    <Card
      mode="contained"
      style={[
        styles.card,
        {
          backgroundColor: isDark
            ? 'rgba(30,30,30,0.9)'
            : 'rgba(255,255,255,0.9)',

          borderWidth: 1,

          //   borderColor: isDark
          //     ? 'rgba(255,255,255,0.08)'
          //     : 'rgba(0,0,0,0.08)',
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 0,
  },
});
