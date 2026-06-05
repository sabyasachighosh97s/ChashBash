import React from 'react';

import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import { useTheme } from 'react-native-paper';
import {
  Container,
  Card,
  Button,
  Icon,
  Headline,
  Paragraph,
} from '@components/ui';
import useThemeMode from '@hook/useThemeMode';

type Props = {
  crop: string;

  market: string;

  price: string;

  onPress?: () => void;
};

const MandiCard = ({ crop, market, price, onPress }: Props) => {
  const { theme } = useThemeMode();

  return (
    <>
      <Card
        // key={item.label}
        variant="contained"
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          // style={[
          //   styles.card,
          //   {
          //     backgroundColor: theme.colors.card,
          //   },
          // ]}
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
              size="md"
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
              { textAlign: 'left', color: theme.colors.subText },
            ]}
          >
            {market}
          </Paragraph>
        </TouchableOpacity>
      </Card>
    </>
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
