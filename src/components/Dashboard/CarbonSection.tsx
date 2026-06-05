import React from 'react';

import { StyleSheet, TouchableOpacity } from 'react-native';

import { Card, Container, Headline, Paragraph } from '@components/ui';

import useThemeMode from '@hook/useThemeMode';

type Props = {
  data: {
    title: string;

    description: string;

    cards: {
      label: string;
      value: string;
    }[];
  };
};

const CarbonSection = ({ data }: Props) => {
  const { theme } = useThemeMode();

  return (
    <>
      <Headline>{data.title}</Headline>

      <Paragraph
        size="base"
        style={{
          textAlign: 'left',
          color: theme.colors.placeholder,
        }}
      >
        {data.description}
      </Paragraph>

      <Container backgroundColor="transparent" style={styles.container}>
        {data.cards.map((item, index) => {
          const isAWD = index === 0;

          return (
            <Card
              key={item.label}
              variant="contained"
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.background,
                },
              ]}
            >
              <Paragraph
                size="base"
                style={{
                  textAlign: 'center',
                  color: isAWD
                    ? theme.colors.headingBlue
                    : theme.colors.success,
                  fontWeight: '900',
                }}
              >
                {item.label} পদ্ধতি
              </Paragraph>

              <Card
                style={[
                  styles.priceBox,
                  {
                    backgroundColor: isAWD ? '#EAF1FF' : '#E8F6E4',
                  },
                ]}
              >
                <Paragraph>আয় করতে পারবেন</Paragraph>

                <Paragraph
                  size="xl"
                  style={{
                    textAlign: 'center',
                    color: isAWD
                      ? theme.colors.headingBlue
                      : theme.colors.success,
                    fontWeight: '900',
                  }}
                >
                  {item.value.split('/')[0]}
                </Paragraph>

                <Paragraph
                  size="xs"
                  style={{
                    textAlign: 'center',
                    color: theme.colors.placeholder,
                  }}
                  numberOfLines={1}
                >
                  প্রতি একর/প্রতি মৌসুম
                </Paragraph>
              </Card>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: isAWD ? '#EAF1FF' : '#E8F6E4',
                  },
                ]}
              >
                <Paragraph
                  size="sm"
                  style={{
                    textAlign: 'center',
                    color: isAWD
                      ? theme.colors.headingBlue
                      : theme.colors.success,
                    fontWeight: '700',
                  }}
                >
                  বিস্তারিত দেখুন →
                </Paragraph>
              </TouchableOpacity>
            </Card>
          );
        })}
      </Container>
    </>
  );
};

export default CarbonSection;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 10,
    marginTop: 10,
  },

  card: {
    width: '48%',
    borderRadius: 28,
    padding: 12,
  },

  priceBox: {
    marginTop: 5,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },

  button: {
    // marginTop: 10,
    // paddingVertical: 8,
    borderRadius: 18,
    alignItems: 'center',
  },
});
