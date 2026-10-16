import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppIcon from '@components/AppIcon/AppIcon';
import colors from '@themes/colors';

export type AccountActionBarItem = {
  key: string;
  label: string;
  icon: string;
  iconColor: string;
  borderColor: string;
  textColor: string;
  onPress: () => void;
};

type AccountActionBarProps = {
  actions: AccountActionBarItem[];
};

const AccountActionBar = ({
  actions,
}: AccountActionBarProps) => {
  return (
    <View style={styles.container}>
      {actions.map(action => (
        <Pressable
          key={action.key}
          style={[
            styles.button,
            {
              borderColor: action.borderColor,
            },
          ]}
          onPress={action.onPress}>
          <AppIcon
            type="MaterialCommunityIcons"
            name={action.icon}
            size={22}
            color={action.iconColor}
          />

          <Text
            style={[
              styles.buttonText,
              {
                color: action.textColor,
              },
            ]}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    flexDirection: 'row',
    gap: 10,
  },

  button: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
  },

  buttonText: {
    fontWeight: '700',
  },
});

export default AccountActionBar;