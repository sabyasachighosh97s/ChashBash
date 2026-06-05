// Paragraph.tsx

import React, {
  memo,
} from 'react';

import {
  StyleSheet,
  TextStyle,
  StyleProp,
} from 'react-native';

import {
  Paragraph as PaperParagraph,
  useTheme,
} from 'react-native-paper';

type Props = {
  children: React.ReactNode;

  style?: StyleProp<TextStyle>;

  numberOfLines?: number;
};

const Paragraph = ({
  children,

  style,

  numberOfLines,
}: Props) => {
  const theme =
    useTheme<any>();

  return (
    <PaperParagraph
      numberOfLines={
        numberOfLines
      }
      style={[
        styles.text,

        {
          color:
            theme.colors
              .onSurfaceVariant,
        },

        style,
      ]}
    >
      {children}
    </PaperParagraph>
  );
};

export default memo(
  Paragraph,
);

const styles =
  StyleSheet.create({
    text: {
      fontSize: 16,

      lineHeight: 24,

      includeFontPadding:
        false,
    },
  });