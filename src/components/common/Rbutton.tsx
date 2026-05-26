import React from 'react';

import {
  Button,
  ButtonProps,
  useTheme,
} from 'react-native-paper';

interface CustomButtonProps extends ButtonProps {
  title: string;
}

export const Rbutton = ({
  title,
  style,
  contentStyle,
  labelStyle,
  ...props
}: CustomButtonProps) => {
  const theme = useTheme();

  return (
    <Button
      mode="contained"
      buttonColor={theme.colors.primary}
      textColor="#fff"
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