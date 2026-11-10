
import React from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import Container from '@components/Container/Container';
import AppIcon from '@components/AppIcon/AppIcon';

import {
  Card,
  Headline,
  Paragraph,
} from '@components/ui';

import {CustomAppBar} from '@components/common/CustomAppBar';
import CustomHeader from '@components/Header/CustomHeader';

import colors from '@themes/colors';

import {useTranslation} from 'react-i18next';

import {FarmAccountEntry} from './FarmAccountScreen';

// =========================================================
// FORMAT MONEY
// =========================================================

const formatMoney = (value: number) =>
  `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (
  date: string,
  language: string,
) => {
  if (!date) {
    return '—';
  }

  // Use the date portion directly to avoid timezone shifts.
  const datePart = date.slice(0, 10);
  const [year, month, day] = datePart.split('-').map(Number);

  if (!year || !month || !day) {
    return date;
  }

  const d = new Date(year, month - 1, day);

  return d.toLocaleDateString(
    language?.startsWith('bn') ? 'bn-IN' : 'en-IN',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  );
};

// =========================================================
// SCREEN
// =========================================================

const FarmAccountDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {t, i18n} = useTranslation();

  const entry: FarmAccountEntry | undefined =
    route.params?.entry;

  if (!entry) {
    return (
      <View style={styles.screen}>
        <CustomAppBar
          title={t('transaction_details')}
          onBackPress={() => navigation.goBack()}
        />

        <View style={styles.empty}>
          <Paragraph>
            {t('transaction_details_unavailable')}
          </Paragraph>
        </View>
      </View>
    );
  }

  const isIncome = entry.type === 'income';

  const accent = isIncome
    ? colors.success
    : colors.error;

  return (
    <Container>
      <CustomHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.icon}>
            <AppIcon
              type="MaterialCommunityIcons"
              name={
                isIncome
                  ? 'cash-plus'
                  : 'cash-minus'
              }
              size={30}
              color={accent}
            />
          </View>

          <Paragraph
            size="xs"
            style={styles.typeLabel}>
            {isIncome ? t('income') : t('expense')}
          </Paragraph>

          <Headline
            size="xxl"
            style={{color: accent}}>
            {isIncome ? '+' : '-'}
            {formatMoney(entry.amount)}
          </Headline>

          <Paragraph style={styles.category}>
            {entry.category || '—'}
          </Paragraph>
        </View>

        {/* DETAILS */}

        <Card style={styles.detailsCard}>
          <Headline
            size="lg"
            style={styles.sectionTitle}>
            {t('transaction_information')}
          </Headline>

          <DetailRow
            icon="calendar-month-outline"
            label={t('date')}
            value={formatDate(
              entry.date,
              i18n.language,
            )}
          />

          <DetailRow
            icon="cash-multiple"
            label={t('payment_method')}
            value={entry.paymentMethod || '—'}
          />

          <DetailRow
            icon="shape-outline"
            label={
              isIncome
                ? t('income_head')
                : t('expense_head')
            }
            value={entry.category || '—'}
          />

          <DetailRow
            icon="text-box-outline"
            label={t('description')}
            value={entry.description || '—'}
          />

      
        </Card>
      </ScrollView>
    </Container>
  );
};

// =========================================================
// DETAIL ROW
// =========================================================

const DetailRow = ({
  icon,
  label,
  value,
  last,
}: {
  icon: string;
  label: string;
  value: string;
  last?: boolean;
}) => (
  <View
    style={[
      styles.row,
      !last && styles.rowBorder,
    ]}>
    <View style={styles.rowIcon}>
      <AppIcon
        type="MaterialCommunityIcons"
        name={icon}
        size={19}
        color={colors.primary}
      />
    </View>

    <View style={styles.rowContent}>
      <Paragraph
        size="xs"
        style={styles.label}>
        {label}
      </Paragraph>

      <Paragraph
        size="sm"
        lineHeight={10}
        style={styles.value}>
        {value}
      </Paragraph>
    </View>
  </View>
);

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  hero: {
    borderRadius: 24,
    alignItems: 'center',
    padding: 26,
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  icon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: colors.border,
  },

  typeLabel: {
    letterSpacing: 1.3,
    fontWeight: '700',
    color: colors.subText,
    marginBottom: 2,
  },

  category: {
    marginTop: 2,
    color: colors.subText,
    fontWeight: '600',
  },

  detailsCard: {
    padding: 18,
  },

  sectionTitle: {
    marginBottom: 4,
  },

  row: {
    flexDirection: 'row',
    paddingVertical: 15,
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  rowContent: {
    flex: 1,
  },

  label: {
    textAlign: 'left',
    color: colors.subText,
    marginBottom: 1,
  },

  value: {
    textAlign: 'left',
    color: colors.text,
    fontWeight: '600',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default FarmAccountDetailScreen;
