import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from 'react-native-paper';

type Props = {
  title: string;

  actionText?: string;

  onPress?: () => void;
};

const SectionHeader = ({ title, actionText, onPress }: Props) => {
  const theme = useTheme<any>();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
          },
        ]}
      >
        {title}
      </Text>

      {actionText && (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
          <Text
            style={[
              styles.actionText,
              {
                color: theme.colors.primary,
              },
            ]}
          >
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  title: {
    fontSize: 26,

    fontWeight: '900',
  },

  actionText: {
    fontSize: 14,

    fontWeight: '700',
  },
});
