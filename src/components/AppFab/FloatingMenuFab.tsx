import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import CustomFab from './CustomFab';
import FabMenu from './FabMenu';

type Props = {
  actions: {
    id: string;
    icon: string;
    label: string;
    color?: string;
    onPress: () => void;
  }[];

  bottom?: number;
};

const FloatingMenuFab = ({ actions, bottom = 34 }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <FabMenu
        visible={open}
        actions={actions.map(item => ({
          ...item,
          onPress: () => {
            setOpen(false);
            item.onPress();
          },
        }))}
        onClose={() => setOpen(false)}
      />

      <CustomFab open={open} bottom={bottom} onPress={() => setOpen(!open)} />
    </View>
  );
};

export default FloatingMenuFab;
