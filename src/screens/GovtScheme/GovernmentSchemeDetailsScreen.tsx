import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { Container, Card, Headline, Paragraph } from '@components/ui';

import AppIcon from '@components/AppIcon/AppIcon';
import useThemeMode from '@hook/useThemeMode';

const GovernmentSchemeDetailsScreen = () => {
  const navigation = useNavigation<any>();

  const route = useRoute<any>();

  const { theme } = useThemeMode();

  const { scheme } = route.params;

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Back */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AppIcon
            type="MaterialCommunityIcons"
            name="arrow-left"
            size={24}
            color={theme.colors.primary}
          />

          <Paragraph
            size="sm"
            style={{
              marginLeft: 8,
              color: theme.colors.primary,
              fontWeight: '700',
            }}
          >
            Back
          </Paragraph>
        </TouchableOpacity>

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
            {scheme.category}
          </Paragraph>
        </View>

        {/* Title */}

        <Headline style={styles.title}>{scheme.title}</Headline>

        {/* Description */}

        <Card
          variant="contained"
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Paragraph size="lg" style={styles.sectionTitle}>
            Description
          </Paragraph>

          <Paragraph
            size="base"
            style={{
              color: theme.colors.placeholder,
              lineHeight: 24,
            }}
          >
            {scheme.description}
          </Paragraph>
        </Card>

        {/* Benefits */}

        <Card
          variant="contained"
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Paragraph size="lg" style={styles.sectionTitle}>
            Benefits
          </Paragraph>

          <Paragraph>• Financial Assistance</Paragraph>

          <Paragraph>• Easy Registration</Paragraph>

          <Paragraph>• Government Support</Paragraph>

          <Paragraph>• Secure Benefits</Paragraph>
        </Card>

        {/* Eligibility */}

        <Card
          variant="contained"
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Paragraph size="lg" style={styles.sectionTitle}>
            Eligibility
          </Paragraph>

          <Paragraph
            size="base"
            style={{
              color: theme.colors.placeholder,
              lineHeight: 24,
            }}
          >
            Farmers having valid land records are eligible to apply for this
            government scheme.
          </Paragraph>
        </Card>

        {/* Documents */}

        <Card
          variant="contained"
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Paragraph size="lg" style={styles.sectionTitle}>
            Required Documents
          </Paragraph>

          <Paragraph>• Aadhaar Card</Paragraph>

          <Paragraph>• Land Record</Paragraph>

          <Paragraph>• Bank Passbook</Paragraph>

          <Paragraph>• Mobile Number</Paragraph>
        </Card>
      </ScrollView>
    </Container>
  );
};

export default GovernmentSchemeDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 40,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 15,
  },

  badgeText: {
    color: '#114603',
    fontWeight: '700',
  },

  title: {
    marginBottom: 20,
  },

  card: {
    marginBottom: 18,
    borderRadius: 24,
    padding: 18,
  },

  sectionTitle: {
    marginBottom: 12,
  },
});
