import React, { useState } from 'react';
import { FAB, Portal } from 'react-native-paper';
import colors from '@themes/colors';
import { useIsFocused } from '@react-navigation/native';

export interface FabAction {
  icon: string;
  label?: string;
  color?: string;
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
  bottom = 88,
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
        backdropColor="rgba(0,0,0,0.18)"
        actions={actions.map(action => ({
          ...action,

          color: colors.textLight,

          style: {
            backgroundColor: action.color ?? colors.primary,
          },

          labelStyle: {
            color: colors.textLight,
            fontWeight: '700',
            fontSize: 15,
          },

          containerStyle: {
            backgroundColor: action.color ?? colors.primary,
            borderRadius: 18,
            elevation: 4,
          },
        }))}
        onStateChange={({ open }) => setOpen(open)}
        fabStyle={{
          backgroundColor: colors.primary,
          borderRadius: 30,
          elevation: 8,
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
