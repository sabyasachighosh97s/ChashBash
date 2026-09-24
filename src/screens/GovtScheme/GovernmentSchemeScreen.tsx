import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Container, Card, Headline, Paragraph } from '@components/ui';

import AppIcon from '@components/AppIcon/AppIcon';
import useThemeMode from '@hook/useThemeMode';
import CustomHeader from '@components/Header/CustomHeader';

const governmentSchemes = [
  {
    id: '1',
    title: 'PM Kisan Samman Nidhi',
    category: 'Financial Assistance',
    description:
      'Income support scheme for eligible farmers through Direct Benefit Transfer.',
  },

  {
    id: '2',
    title: 'Pradhan Mantri Fasal Bima Yojana',
    category: 'Crop Insurance',
    description:
      'Provides insurance coverage against crop loss due to natural calamities.',
  },
];

const GovernmentSchemeScreen = () => {
  const navigation = useNavigation<any>();

  const { theme } = useThemeMode();

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('GovernmentSchemeDetails', {
            scheme: item,
          })
        }
      >
        <Card
          variant="contained"
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          {/* Category */}

          <View
            style={[
              styles.badge,
              {
                backgroundColor: theme.colors.accent,
              },
            ]}
          >
            <Paragraph size="xs" style={styles.badgeText}>
              {item.category}
            </Paragraph>
          </View>

          {/* Title */}

          <View style={styles.titleContainer}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="bank-outline"
              size={28}
              color={theme.colors.primary}
            />

            <Headline style={styles.title}>{item.title}</Headline>
          </View>

          {/* Description */}

          <Paragraph
            size="sm"
            style={[
              styles.description,
              {
                color: theme.colors.placeholder,
              },
            ]}
          >
            {item.description}
          </Paragraph>

          {/* Bottom */}

          <View style={styles.footer}>
            <Paragraph
              size="sm"
              style={[
                styles.details,
                {
                  color: theme.colors.headingBlue,
                },
              ]}
            >
              বিস্তারিত দেখুন
            </Paragraph>

            <AppIcon
              type="MaterialCommunityIcons"
              name="arrow-right-circle"
              size={24}
              color={theme.colors.headingBlue}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <CustomHeader />
      <View style={styles.header}>
        <Headline>Government Schemes</Headline>

        <Paragraph
          size="base"
          style={{
            color: theme.colors.placeholder,
            marginTop: 6,
          }}
        >
          Explore government schemes available for farmers.
        </Paragraph>
      </View>

      <FlatList
        data={governmentSchemes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default GovernmentSchemeScreen;
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 10,
  },

  listContainer: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  card: {
    marginBottom: 16,
    borderRadius: 24,
    padding: 18,
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },

  badgeText: {
    color: '#114603',
    fontWeight: '700',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    marginLeft: 12,
  },

  description: {
    marginTop: 14,
    lineHeight: 22,
  },

  footer: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E6E9EC',
    paddingTop: 14,
  },

  details: {
    fontWeight: '700',
  },
});
