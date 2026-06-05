import React from 'react';

import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import { useTheme } from 'react-native-paper';
import Headline from '@components/common/Headline';
import Paragraph from '@components/common/Paragraph';
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
        <Paragraph
          style={[
            styles.crop,
            {
              color: theme.colors.text,
            },
          ]}
        >
          {crop}
        </Paragraph>

        <Paragraph
          style={[
            styles.price,
            {
              color: theme.colors.success,
            },
          ]}
        >
          {price}
        </Paragraph>
      </View>

      <Paragraph
        style={[
          styles.market,
          {
            color: theme.colors.subText,
          },
        ]}
      >
        {market}
      </Paragraph>
    </TouchableOpacity>
  );
};

export default MandiCard;

const styles = StyleSheet.create({
  card: {
    width: '49%',

    borderRadius: 22,

    paddingVertical: 10,

    paddingHorizontal: 14,

    marginBottom: 10,
  },

  topRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  crop: {
    fontWeight: '800',
  },

  price: {
    fontSize: 14,
    fontWeight: '900',
  },

  market: {
    // marginTop: 5,
    fontSize: 12,
  },
});
