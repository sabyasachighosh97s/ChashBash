import React, { memo } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useTheme } from 'react-native-paper';
type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
interface CustomTextProps {
  children: React.ReactNode;
  variant?: Variant;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}
const RtextComponent = ({
  children,
  variant = 'body',
  style,
  numberOfLines,
}: CustomTextProps) => {
  const theme = useTheme<any>();
  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: 32,
          fontWeight: '700',
          lineHeight: 40,
        };

      case 'h2':
        return {
          fontSize: 28,
          fontWeight: '700',
          lineHeight: 36,
        };

      case 'h3':
        return {
          fontSize: 24,
          fontWeight: '600',
          lineHeight: 32,
        };

      case 'h4':
        return {
          fontSize: 20,
          fontWeight: '600',
          lineHeight: 28,
        };

      case 'caption':
        return {
          fontSize: 12,
          fontWeight: '400',
          lineHeight: 18,
        };

      case 'body':
      default:
        return {
          fontSize: 16,
          fontWeight: '400',
          lineHeight: 24,
        };
    }
  };

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          color: theme.colors.onSurface,
        },

        getTextStyle(),

        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const Rtext = memo(RtextComponent);
