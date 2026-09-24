import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AppIcon from '@components/AppIcon/AppIcon';
import useThemeMode from '@hook/useThemeMode';

type Props = {
  isGridView: boolean;
  onToggle: () => void;
};

const ViewModeToggle = ({ isGridView, onToggle }: Props) => {
  const { theme } = useThemeMode();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onToggle}
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
      ]}
    >
      <AppIcon
        type="MaterialCommunityIcons"
        name={isGridView ? 'view-list' : 'view-grid'}
        size={20}
        color="#fff"
      />
    </TouchableOpacity>
  );
};

export default ViewModeToggle;

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
});
