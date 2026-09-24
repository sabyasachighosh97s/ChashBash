import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Paragraph } from '@components/ui';
import AppIcon from '@components/AppIcon/AppIcon';
import useThemeMode from '@hook/useThemeMode';

export type FabAction = {
  id: string;
  icon: string;
  label: string;
  color?: string;
  onPress: () => void;
};

type Props = {
  item: FabAction;
};

const FabActionItem = ({ item }: Props) => {
  const { theme } = useThemeMode();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={item.onPress}
      style={styles.container}
    >
      <View
        style={[
          styles.labelContainer,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: item.color ?? theme.colors.primary,
            },
          ]}
        >
          <AppIcon
            type="MaterialCommunityIcons"
            name={item.icon}
            size={16}
            color={theme.colors.accent}
          />
        </View>

        <Paragraph size="sm" style={styles.label} numberOfLines={1}>
          {item.label}
        </Paragraph>
      </View>
    </TouchableOpacity>
  );
};

export default FabActionItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },

  labelContainer: {
    width: '100%', // Same width for all buttons
    height: 45,
    borderRadius: 24,
    paddingHorizontal: 5,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    elevation: 4,
  },

  label: {
    flex: 1,
    fontWeight: '700',
    textAlign: 'left',
  },

  iconContainer: {
    width: 25,
    height: 25,
    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 5,
  },
});
