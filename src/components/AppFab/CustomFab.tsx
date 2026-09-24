import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

import AppIcon from '@components/AppIcon/AppIcon';
import colors from '@themes/colors';

type Props = {
  onPress: () => void;

  open?: boolean;

  size?: number;

  bottom?: number;

  backgroundColor?: string;
  align?: 'center' | 'right';
  style?: ViewStyle;
};

const CustomFab = ({
  onPress,
  open = false,
  size = 50,
  bottom = 34,
  backgroundColor = colors.accent,
  align = 'right',
  style,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.container,

        align === 'center'
          ? {
              left: '50%',
              marginLeft: -(size / 2),
            }
          : {
              right: 20,
            },

        {
          width: size,
          height: size,
          borderRadius: size / 2,
          bottom,
          backgroundColor,
        },

        style,
      ]}
    >
      <AppIcon
        type="MaterialCommunityIcons"
        name={open ? 'close' : 'plus'}
        size={30}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
};

export default CustomFab;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    justifyContent: 'center',

    alignItems: 'center',

    // elevation: 10,

    // shadowColor: '#000',

    // shadowOffset: {
    //   width: 0,
    //   height: 6,
    // },

    // shadowOpacity: 0.25,

    // shadowRadius: 8,

    borderWidth: 5,

    borderColor: colors.bottomBar,

    zIndex: 999,
  },
});
