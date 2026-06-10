import React, { useState } from 'react';
import { FAB, Portal } from 'react-native-paper';
import colors from '@themes/colors';
import { useIsFocused } from '@react-navigation/native';

export interface FabAction {
  icon: string;
  label?: string;
  onPress: () => void;
}

type AppFabProps = {
  actions: FabAction[];
  bottom?: number;
  right?: number;
  icon?: string;
  openIcon?: string;
  visible?: boolean;
};

const AppFab = ({
  actions,
  bottom = 90,
  right = 16,
  icon = 'plus',
  openIcon = 'close',
  visible = true,
}: AppFabProps) => {
  const [open, setOpen] = useState(false);
  const isFocused = useIsFocused();

  if (!isFocused || !visible) {
    return null;
  }
  return (
    <Portal>
      <FAB.Group
        open={open}
        visible={visible}
        icon={open ? openIcon : icon}
        color={colors.textLight}
        backdropColor="rgba(255, 255, 255, 0.73)"
        actions={actions.map(action => ({
          ...action,

          color: colors.textLight,

          style: {
            backgroundColor: colors.primary,
          },

          labelStyle: {
            color: colors.textLight,
          },

          containerStyle: {
            backgroundColor: colors.primary,
            borderRadius: 12,
          },
        }))}
        onStateChange={({ open }) => setOpen(open)}
        fabStyle={{
          backgroundColor: colors.primary,
        }}
        style={{
          position: 'absolute',
          right,
          bottom,
        }}
      />
    </Portal>
  );
};

export default AppFab;
