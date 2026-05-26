import React from 'react';

import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import { useTheme } from 'react-native-paper';

type Props = {
  crop: string;

  market: string;

  price: string;

  onPress?: () => void;
};

const MandiCard = ({ crop, market, price, onPress }: Props) => {
  const theme = useTheme<any>();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text
          style={[
            styles.crop,
            {
              color: theme.colors.text,
            },
          ]}
        >
          {crop}
        </Text>

        <Text
          style={[
            styles.price,
            {
              color: theme.colors.success,
            },
          ]}
        >
          {price}
        </Text>
      </View>

      <Text
        style={[
          styles.market,
          {
            color: theme.colors.subText,
          },
        ]}
      >
        {market}
      </Text>
    </TouchableOpacity>
  );
};

export default MandiCard;

const styles = StyleSheet.create({
  card: {
    width: '49%',

    borderRadius: 22,

    paddingVertical: 14,

    paddingHorizontal: 14,

    marginBottom: 12,
  },

  topRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  crop: {
    fontSize: 14,

    fontWeight: '800',
  },

  price: {
    fontWeight: '900',
  },

  market: {
    marginTop: 5,

    fontSize: 12,
  },
});
