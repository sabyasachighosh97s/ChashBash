// Divider.tsx


import useThemeMode from '@hook/useThemeMode';
import React, { memo } from 'react';

import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
type Props = {
  style?: StyleProp<ViewStyle>;
  color?: string;
  thickness?: number;
  marginVertical?: number;
};
const Divider = ({
  style,
  color,
  thickness = StyleSheet.hairlineWidth,
  marginVertical = 12,
}: Props) => {
  const { theme } = useThemeMode();
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color ?? theme.colors.border,
          height: thickness,
          marginVertical,
        },
        style,
      ]}
    />
  );
};

export default memo(Divider);

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});
