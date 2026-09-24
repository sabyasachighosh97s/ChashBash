import React, { memo } from 'react';
import { StyleSheet, TextStyle, StyleProp } from 'react-native';
import { Paragraph as PaperParagraph, useTheme } from 'react-native-paper';
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
const Paragraph = ({
  children,
  style,
  numberOfLines,
  size = 'sm',
  textColor,
  fontStyle = 'normal',
  fontFamily,
}: Props) => {
  const theme = useTheme<any>();
  const cusStyle: TextStyle = {
    fontStyle,
    color: textColor ?? theme.colors.onSurfaceVariant,
    fontSize: fontSize[size],
    fontFamily,
  };
  return (
    <PaperParagraph
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      style={[styles.text, cusStyle, style]}
    >
      {children}
    </PaperParagraph>
  );
};
export default memo(Paragraph);
const styles = StyleSheet.create({
  text: {
    lineHeight: 24,
    includeFontPadding: false,
    textAlign: 'center',
  },
});
