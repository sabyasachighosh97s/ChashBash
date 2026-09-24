import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import CustomFab from './CustomFab';
import FabMenu from './FabMenu';

import { FabAction } from '@navigation/fab/fabTypes';
import { navigate } from '@navigation/fab/fabNavigator';

type Props = {
  actions: FabAction[];
  bottom?: number;

  /**
   * Optional custom action handler.
   *
   * Existing screens such as Community do not need to use this.
   * If it is not provided, SideFab keeps the existing
   * route-based navigation behavior.
   */
  onActionPress?: (action: FabAction) => void;
};

const SideFab = ({
  actions,
  bottom = 100,
  onActionPress,
}: Props) => {
  const [open, setOpen] = useState(false);

  if (actions.length === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}>
      
      <FabMenu
        visible={open}
        actions={actions.map(item => ({
          ...item,

          onPress: () => {
            setOpen(false);

            /**
             * Custom handler থাকলে caller নিজের
             * navigation / params handle করবে।
             *
             * না থাকলে existing behavior unchanged:
             * route দিয়ে normal navigation হবে।
             */
            if (onActionPress) {
              onActionPress(item);
              return;
            }

            navigate(item.route);
          },
        }))}
      />

      <CustomFab
        open={open}
        align="right"
        bottom={bottom}
        onPress={() => setOpen(!open)}
      />
    </View>
  );
};

export default SideFab;