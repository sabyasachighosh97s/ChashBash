import useThemeMode from '@hook/useThemeMode';
import React, { ReactNode } from 'react';
import {
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { Card } from 'react-native-paper';
type CardVariant = 'default' | 'outlined' | 'contained';
type CustomCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
  onPress?: (event: GestureResponderEvent) => void;
};
const CustomCard = ({
  children,
  style,
  variant = 'default',
  onPress,
}: CustomCardProps) => {
  const { theme, isDark } = useThemeMode();
  const colors = theme.colors;
  const cardStyle = [
    styles.card,
    // DEFAULT
    variant === 'default' && {
      backgroundColor: colors.surface,
      borderWidth: 0.5,
      borderColor: colors.border,
    },
    // OUTLINED
    variant === 'outlined' && {
      borderWidth: 0.5,
      borderColor: colors.outline,
      backgroundColor: 'transparent',
      elevation: 0,
    },
    // CONTAINED
    variant === 'contained' && {
      borderWidth: 0,
      backgroundColor: 'transparent',
      elevation: 0,
    },

    style,
  ];
  const CardWrapper = onPress ? TouchableOpacity : React.Fragment;
  const wrapperProps = onPress
    ? {
        onPress,
        activeOpacity: 0.7,
      }
    : {};
  return (
    <CardWrapper {...wrapperProps}>
      <Card mode="contained" style={cardStyle}>
        {children}
      </Card>
    </CardWrapper>
  );
};
const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 0,
  },
});
export default CustomCard;
