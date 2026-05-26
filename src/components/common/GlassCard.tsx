import React from 'react';

import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

import { useTheme } from 'react-native-paper';

type Props = {
  children: React.ReactNode;

  style?: StyleProp<ViewStyle>;
};

const GlassCard = ({ children, style }: Props) => {
  const theme = useTheme<any>();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.glass,

          borderColor: theme.colors.glassBorder,
        },

        style,
      ]}
    >
      {children}
    </View>
  );
};

export default GlassCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,

    padding: 16,

    borderWidth: 1,

    overflow: 'hidden',
  },
});
