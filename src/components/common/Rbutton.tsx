import React from 'react';

import { Button, ButtonProps, useTheme } from 'react-native-paper';

interface CustomButtonProps extends Omit<ButtonProps, 'children'> {
  title: string;
  buttonColor?: string;
  textColor?: string;
}

export const Rbutton = ({
  title,
  style,
  buttonColor,
  textColor,
  contentStyle,
  labelStyle,
  ...props
}: CustomButtonProps) => {
  const theme = useTheme();

  return (
    <Button
      mode="contained"
      buttonColor={buttonColor || theme.colors.primary}
      textColor={textColor || '#fff'}
      style={[
        {
          borderRadius: 12,
        },
        style,
      ]}
      contentStyle={[
        {
          height: 52,
        },
        contentStyle,
      ]}
      labelStyle={[
        {
          fontSize: 16,
          fontWeight: '600',
        },
        labelStyle,
      ]}
      {...props}
    >
      {title}
    </Button>
  );
};
