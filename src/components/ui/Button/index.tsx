// Button.tsx

import useThemeMode from '@hook/useThemeMode';
import React, { memo } from 'react';

import { StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';

import { Button as PaperButton } from 'react-native-paper';



type ButtonMode =
  | 'text'
  | 'outlined'
  | 'contained'
  | 'elevated'
  | 'contained-tonal';

type Props = {
  children: React.ReactNode;

  onPress?: () => void;

  mode?: ButtonMode;

  icon?: string;

  loading?: boolean;

  disabled?: boolean;

  uppercase?: boolean;

  compact?: boolean;

  style?: StyleProp<ViewStyle>;

  labelStyle?: StyleProp<TextStyle>;

  contentStyle?: StyleProp<ViewStyle>;

  backgroundColor?: string;

  textColor?: string;

  borderColor?: string;
};

const Button = ({
  children,
  onPress,
  mode = 'contained',
  icon,
  loading = false,
  disabled = false,
  uppercase = false,
  compact = false,
  style,
  labelStyle,
  contentStyle,
  backgroundColor,
  textColor,
  borderColor,
  ...props
}: Props) => {
  const { theme, isDark } = useThemeMode();
  const colors = theme.colors;
  const buttonStyle = [
    styles.button,
    // CONTAINED
    mode === 'contained' && {
      backgroundColor: backgroundColor ?? colors.primary,
    },
    // OUTLINED
    mode === 'outlined' && {
      borderWidth: 1,
      borderColor: borderColor ?? colors.outline,
      backgroundColor: backgroundColor ?? 'transparent',
    },
    // TEXT
    mode === 'text' && {
      backgroundColor: backgroundColor ?? 'transparent',
    },
    style,
  ];

  const textStyles = [
    styles.label,
    {
      color:
        textColor ?? (mode === 'contained' ? colors.onPrimary : colors.primary),
    },
    labelStyle,
  ];
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      icon={icon}
      loading={loading}
      disabled={disabled}
      uppercase={uppercase}
      compact={compact}
      buttonColor={backgroundColor}
      textColor={textColor}
      style={buttonStyle}
      labelStyle={textStyles}
      contentStyle={[styles.content, contentStyle]}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

export default memo(Button);

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,

    borderRadius: 14,

    overflow: 'hidden',
  },

  content: {
    paddingVertical: 6,
  },

  label: {
    fontSize: 16,

    fontWeight: '600',

    includeFontPadding: false,
  },
});
