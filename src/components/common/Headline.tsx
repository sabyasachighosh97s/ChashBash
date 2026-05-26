// Headline.tsx

import React, {
  memo,
} from 'react';

import {
  StyleSheet,
  TextStyle,
  StyleProp,
} from 'react-native';

import {
  Headline as PaperHeadline,
  useTheme,
} from 'react-native-paper';

type Props = {
  children: React.ReactNode;

  style?: StyleProp<TextStyle>;

  numberOfLines?: number;
};

const Headline = ({
  children,

  style,

  numberOfLines,
}: Props) => {
  const theme =
    useTheme<any>();

  return (
    <PaperHeadline
      numberOfLines={
        numberOfLines
      }
      style={[
        styles.text,

        {
          color:
            theme.colors
              .onSurface,
        },

        style,
      ]}
    >
      {children}
    </PaperHeadline>
  );
};

export default memo(
  Headline,
);

const styles =
  StyleSheet.create({
    text: {
      fontWeight: '700',

      includeFontPadding:
        false,
    },
  });