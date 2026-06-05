// Headline.tsx

import React, { memo } from 'react';

import { StyleSheet, TextStyle, StyleProp } from 'react-native';

import { Headline as PaperHeadline, useTheme } from 'react-native-paper';

import fontSize, { FontSizeKey } from '@themes/FontSize';

type Props = {
  children: React.ReactNode;

  style?: StyleProp<TextStyle>;

  numberOfLines?: number;

  size?: FontSizeKey;

  textColor?: string;

  fontStyle?: TextStyle['fontStyle'];

  fontFamily?: string;
};

const Headline = ({
  children,
  style,
  numberOfLines,
  size = 'lg',
  textColor,
  fontStyle = 'normal',
  fontFamily,
}: Props) => {
  const theme = useTheme<any>();
  const cusStyle: TextStyle = {
    fontStyle,
    color: textColor ?? theme.colors.onSurface,
    fontSize: fontSize[size],
    fontFamily,
  };
  return (
    <PaperHeadline
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      style={[styles.text, cusStyle, style]}
    >
      {children}
    </PaperHeadline>
  );
};

export default memo(Headline);

const styles = StyleSheet.create({
  text: {
    fontWeight: '700',
    includeFontPadding: false,
  },
});
