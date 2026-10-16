import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppIcon from '@components/AppIcon/AppIcon';
import colors from '@themes/colors';

export type AccountFilterTabItem<T extends string> = {
  value: T;
  label: string;
  icon: string;
  color: string;
};

type AccountFilterTabsProps<T extends string> = {
  value: T;
  tabs: AccountFilterTabItem<T>[];
  onChange: (value: T) => void;
};

const AccountFilterTabs = <T extends string>({
  value,
  tabs,
  onChange,
}: AccountFilterTabsProps<T>) => {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const active = value === tab.value;

        return (
          <Pressable
            key={tab.value}
            onPress={() => onChange(tab.value)}
            android_ripple={{
              color: colors.glassLight,
            }}
            style={[
              styles.button,
              active && {
                backgroundColor: tab.color,
                borderColor: tab.color,
              },
            ]}>
            <View
              style={[
                styles.iconContainer,
                active && styles.activeIconContainer,
              ]}>
              <AppIcon
                type="MaterialCommunityIcons"
                name={tab.icon}
                size={20}
                color={active ? colors.textLight : tab.color}
              />
            </View>

            <Text
              numberOfLines={1}
              style={[
                styles.text,
                active && styles.activeText,
              ]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: 16,
  },

  button: {
    flex: 1,
    minHeight: 52,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    backgroundColor: colors.border,
  },

  activeIconContainer: {
    backgroundColor: colors.glassLight,
  },

  text: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 12,
    includeFontPadding: false,
  },

  activeText: {
    color: colors.textLight,
    fontWeight: '800',
  },
});

export default AccountFilterTabs;