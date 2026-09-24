import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import CustomFab from './CustomFab';
import FabMenu from './FabMenu';
import { FabScreenName } from '@navigation/fab/fabTypes';
import { fabRegistry } from '@navigation/fab/fabRegistry';
import { navigate } from '@navigation/fab/fabNavigator';

type Props = {
  currentScreen: FabScreenName;
};
const CenterFab = ({ currentScreen }: Props) => {
  const [open, setOpen] = useState(false);
  const actions = (fabRegistry[currentScreen] ?? [])
    .filter(item => item.visible !== false)
    .filter(item => item.enabled !== false)
    .map(item => item.action);
  console.log('Current Screen:', currentScreen);
  if (actions.length === 0) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <FabMenu
        visible={open}
        bottom={120}
        actions={actions.map(item => ({
          ...item,
          onPress: () => {
            setOpen(false);
            navigate(item.route);
          },
        }))}
        onClose={() => setOpen(false)}
      />

      <CustomFab
        open={open}
        bottom={34}
        align="center"
        onPress={() => setOpen(!open)}
      />
    </View>
  );
};

export default CenterFab;
