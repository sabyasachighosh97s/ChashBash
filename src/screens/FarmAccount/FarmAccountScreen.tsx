import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import {useFocusEffect, useNavigation} from '@react-navigation/native';

import AppIcon from '@components/AppIcon/AppIcon';
import {Card, Headline, Paragraph} from '@components/ui';
import {CustomAppBar} from '@components/common/CustomAppBar';
import colors from '@themes/colors';
import {getItem, setItem} from '@utils/storage';
import {useTranslation} from 'react-i18next';
import CustomHeader from '@components/Header/CustomHeader';
import Container from '@components/Container/Container';
import GuestAccessModal, {
  useGuestAccess,
} from '@components/common/GuestAccess';
export type FarmAccountType = 'income' | 'expense';

export type FarmAccountEntry = {
  id: string;
  type: FarmAccountType;
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
  description: string;
  notes?: string;
};

export const FARM_ACCOUNT_STORAGE_KEY =
  'chashbash_farm_account_entries';

/*
=========================================================
DEMO DATA
=========================================================

These are data values, not UI translations.

When API is integrated, this entire source can be replaced
by API response without changing the UI structure.
*/

const DEMO_ENTRIES: FarmAccountEntry[] = [
  {
    id: 'demo-1',
    type: 'income',
    category: 'Crop Sale',
    amount: 18500,
    date: '2026-09-22',
    paymentMethod: 'Bank Transfer',
    description: 'Paddy sale to local market',
    notes: 'First lot of the season',
  },
  {
    id: 'demo-2',
    type: 'expense',
    category: 'Fertilizer',
    amount: 4200,
    date: '2026-09-20',
    paymentMethod: 'Cash',
    description: 'Urea and DAP purchase',
    notes: 'For the current crop cycle',
  },
  {
    id: 'demo-3',
    type: 'expense',
    category: 'Labour',
    amount: 2800,
    date: '2026-09-18',
    paymentMethod: 'Cash',
    description: 'Field preparation labour',
  },
  {
    id: 'demo-4',
    type: 'income',
    category: 'Vegetable Sale',
    amount: 7600,
    date: '2026-09-16',
    paymentMethod: 'UPI',
    description: 'Seasonal vegetable sale',
  },
];

const currency = '₹';

const formatMoney = (value: number) =>
  `${currency}${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date: string, language: string) => {
  const d = new Date(`${date}T00:00:00`);

  return d.toLocaleDateString(
    language?.startsWith('bn') ? 'bn-IN' : 'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );
};

const FarmAccountScreen = () => {
  const navigation = useNavigation<any>();

  const {t, i18n} = useTranslation();

  const {
    isGuest,
    visible,
    openGuestAccess,
    closeGuestAccess,
    goToRegistration,
  } = useGuestAccess();

  const [entries, setEntries] = useState<FarmAccountEntry[]>([]);

  /*
   * BUSINESS LOGIC UNCHANGED
   *
   * all     -> all transactions
   * income  -> income transactions
   * expense -> expense transactions
   */
  const [filter, setFilter] =
    useState<'all' | FarmAccountType>('all');

  const [refreshing, setRefreshing] = useState(false);

  /*
  =========================================================
  LOAD ENTRIES
  =========================================================
  */

 const loadEntries = useCallback(async () => {
  // Guest users must not see demo/local financial data.
  if (isGuest) {
    setEntries([]);
    return;
  }

  const stored = await getItem(FARM_ACCOUNT_STORAGE_KEY);

  if (Array.isArray(stored) && stored.length > 0) {
    setEntries(stored);
    return;
  }

  await setItem(FARM_ACCOUNT_STORAGE_KEY, DEMO_ENTRIES);

  setEntries(DEMO_ENTRIES);
}, [isGuest]);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries]),
  );

  /*
  =========================================================
  REFRESH
  =========================================================
  */

  const refresh = async () => {
    setRefreshing(true);

    await loadEntries();

    setRefreshing(false);
  };

  /*
  =========================================================
  TOTALS
  =========================================================
  */

  const totals = useMemo(() => {
    const income = entries
      .filter(item => item.type === 'income')
      .reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0,
      );

    const expense = entries
      .filter(item => item.type === 'expense')
      .reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0,
      );

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [entries]);

  /*
  =========================================================
  FILTER
  =========================================================
  */

  const filteredEntries = useMemo(
    () =>
      filter === 'all'
        ? entries
        : entries.filter(item => item.type === filter),
    [entries, filter],
  );

  /*
  =========================================================
  NAVIGATION
  =========================================================
  */

const openAdd = (type: FarmAccountType) => {
  if (isGuest) {
    openGuestAccess();
    return;
  }

  navigation.navigate('FarmAccountEntry', {type});
};

  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <Container>
      <CustomHeader />

      <FlatList
        data={filteredEntries}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            {/* =================================================
                HERO
            ================================================= */}

            <View style={styles.hero}>
              <View style={styles.heroIcon}>
                <AppIcon
                  type="MaterialCommunityIcons"
                  name="finance"
                  size={28}
                  color={colors.primary}
                />
              </View>

              <View style={styles.heroCopy}>
                <Headline
                  size="base"
                  style={styles.heroTitle}>
                  {t('farm_finances')}
                </Headline>

                <Paragraph
                  size="xs"
                  style={styles.heroText}>
                  {t('farm_finances_description')}
                </Paragraph>
              </View>
            </View>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <View style={styles.summaryRow}>
              <SummaryCard
                icon="arrow-down-circle"
                label={t('income')}
                value={formatMoney(totals.income)}
                iconColor={colors.success}
              />

              <SummaryCard
                icon="arrow-up-circle"
                label={t('expense')}
                value={formatMoney(totals.expense)}
                iconColor={colors.error}
              />
            </View>

            {/* =================================================
                BALANCE
            ================================================= */}

            <Card style={styles.balanceCard}>
              <View style={styles.balanceLeft}>
                <View style={styles.balanceIcon}>
                  <AppIcon
                    type="MaterialCommunityIcons"
                    name="scale-balance"
                    size={22}
                    color={colors.primary}
                  />
                </View>

                <View>
                  <Paragraph
                    size="xs"
                    style={styles.balanceLabel}>
                    {t('net_balance')}
                  </Paragraph>

                  <Headline
                    size="xl"
                    style={styles.balanceValue}>
                    {formatMoney(totals.balance)}
                  </Headline>
                </View>
              </View>

          
            </Card>

            {/* =================================================
                TRANSACTIONS HEADER
            ================================================= */}


            {/* =================================================
                FARM ACCOUNT TABS

                Same visual concept as:
                Camera / Training / Information
                on Home Screen.

                BUSINESS LOGIC IS UNCHANGED.
            ================================================= */}

            <View style={styles.tabContainer}>
              <AccountTab
                type="all"
                label={t('all')}
                icon="view-list-outline"
                active={filter === 'all'}
                color={colors.lightBlube}
                  deepColor={colors.deepBlue}
                onPress={() => setFilter('all')}
              />

              <AccountTab
                type="income"
                label={t('income')}
                icon="arrow-down-circle-outline"
                active={filter === 'income'}
                color={colors.lightGreen}
                  deepColor={colors.deepGreen}
                onPress={() => setFilter('income')}
              />

              <AccountTab
                type="expense"
                label={t('expense')}
                icon="arrow-up-circle-outline"
                active={filter === 'expense'}
                color={colors.lightMeroon}
                 deepColor={colors.deepMeroon}
                onPress={() => setFilter('expense')}
              />
            </View>
          </>
        }
        renderItem={({item}) => (
          <TransactionCard
            item={item}
            language={i18n.language}
            onPress={() =>
              navigation.navigate('FarmAccountDetail', {
                entry: item,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="wallet-outline"
              size={42}
              color={colors.subText}
            />

            <Headline
              size="lg"
              style={styles.emptyTitle}>
              {t('no_transactions_yet')}
            </Headline>

            <Paragraph size="sm">
              {t('add_first_transaction')}
            </Paragraph>
          </View>
        }
      />

      {/* =====================================================
          ACTION BAR
      ===================================================== */}

      <View style={styles.actionBar}>
        <Pressable
          style={[
            styles.actionButton,
            styles.expenseButton,
          ]}
          onPress={() => openAdd('expense')}>
          <AppIcon
            type="MaterialCommunityIcons"
            name="arrow-up-circle-outline"
            size={22}
            color={colors.surface}
          />

          <Paragraph style={styles.actionExpenseText}>
            {t('add_expense')}
          </Paragraph>
        </Pressable>

        <Pressable
          style={[
            styles.actionButton,
            styles.incomeButton,
          ]}
          onPress={() => openAdd('income')}>
          <AppIcon
            type="MaterialCommunityIcons"
            name="arrow-down-circle-outline"
            size={22}
            color={colors.surface}
          />

          <Paragraph style={styles.actionIncomeText}>
            {t('add_income')}
          </Paragraph>
        </Pressable>
      </View>
            <GuestAccessModal
        visible={visible}
        onClose={closeGuestAccess}
        onRegister={goToRegistration}
      />
    </Container>
  );
};

/*
=========================================================
SUMMARY CARD
=========================================================
*/

const SummaryCard = ({
  icon,
  label,
  value,
  iconColor,
}: {
  icon: string;
  label: string;
  value: string;
  iconColor: string;
}) => (
  <Card style={styles.summaryCard}>
    <View style={styles.summaryIcon}>
      <AppIcon
        type="MaterialCommunityIcons"
        name={icon}
        size={22}
        color={iconColor}
      />
    </View>

    <Paragraph
      size="xs"
      lineHeight={10}
      style={styles.summaryLabel}>
      {label}
    </Paragraph>

    <Headline
      size="lg"
      style={styles.summaryValue}>
      {value}
    </Headline>
  </Card>
);

/*
=========================================================
FARM ACCOUNT TAB
=========================================================

This is the new UI component.

It follows the same design idea as the Home Screen tabs:
Camera / Training / Information.

No business logic is inside this component.
It only calls the existing setFilter().
=========================================================
*/

const AccountTab = ({
  type,
  label,
  icon,
  active,
  color,
  onPress,
    deepColor,
}: {
  type: 'all' | 'income' | 'expense';
  label: string;
  icon: string;
  active: boolean;
  color: string;
    deepColor: string;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: colors.glassLight,
      }}
     style={[
  styles.tabButton,
  {
    backgroundColor: active ? color : colors.surface,
    borderColor: active ? deepColor : color,
  },
]}>
      
      <View
        style={[
          styles.tabIconContainer,
          active && styles.activeTabIconContainer,
        ]}>
        <AppIcon
          type="MaterialCommunityIcons"
          name={icon}
          size={20}
        color={deepColor}
        />
      </View>

      <Paragraph
        size="xs"
        numberOfLines={1}
       style={[
  styles.tabText,
  {
    color: deepColor,
  },
  active && styles.activeTabText,
]}>
        {label}
      </Paragraph>
    </Pressable>
  );
};

/*
=========================================================
TRANSACTION CARD
=========================================================
*/

const TransactionCard = ({
  item,
  language,
  onPress,
}: {
  item: FarmAccountEntry;
  language: string;
  onPress: () => void;
}) => {
  const isIncome = item.type === 'income';

  const accent = isIncome
    ? colors.success
    : colors.error;

  return (
    <Card
      onPress={onPress}
      style={styles.transactionCard}>
      <View style={styles.transactionTop}>
        <View style={styles.transactionIcon}>
          <AppIcon
            type="MaterialCommunityIcons"
            name={
              isIncome
                ? 'arrow-bottom-left'
                : 'arrow-top-right'
            }
            size={22}
            color={accent}
          />
        </View>

        <View style={styles.transactionMain}>
          <Headline
            size="md"
            numberOfLines={1}>
            {item.category}
          </Headline>

          <Paragraph
            size="xs"
            lineHeight={10}
            numberOfLines={1}
            style={styles.description}>
            {item.description}
          </Paragraph>
        </View>

        <View style={styles.amountWrap}>
          <Headline
            size="md"
            style={{color: accent}}>
            {isIncome ? '+' : '-'}
            {formatMoney(item.amount)}
          </Headline>

          <Paragraph
            size="xs"
            lineHeight={20}
            style={styles.dateText}>
            {formatDate(item.date, language)}
          </Paragraph>
        </View>
      </View>

      <View style={styles.transactionFooter}>
        <View style={styles.method}>
          <AppIcon
            type="MaterialCommunityIcons"
            name="cash-multiple"
            size={15}
            color={colors.subText}
          />

          <Paragraph size="xs">
            {item.paymentMethod}
          </Paragraph>
        </View>

        <View style={styles.viewDetails}>
          <Paragraph
            size="xs"
            style={styles.viewDetailsText}>
            {useTranslation().t('view_details')}
          </Paragraph>

          <AppIcon
            type="MaterialCommunityIcons"
            name="chevron-right"
            size={18}
            color={colors.primary}
          />
        </View>
      </View>
    </Card>
  );
};

/*
=========================================================
STYLES
=========================================================
*/

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 130,
  },

  /*
  ========================================================
  HERO
  ========================================================
  */

  hero: {
    marginTop: 8,
    marginBottom: 16,
    padding: 8,
    borderRadius: 22,
    backgroundColor: colors.backdrop,
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  heroCopy: {
    flex: 1,
  },

  heroTitle: {
    color: colors.textLight,
    marginBottom: 2,
lineHeight: 22, },

  heroText: {
    color: colors.textLight,
    opacity: 0.78,
    textAlign: 'left',
  },

  /*
  ========================================================
  SUMMARY
  ========================================================
  */

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  summaryCard: {
    flex: 1,
    padding: 15,
    marginBottom: 0,
  },

  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  summaryLabel: {
    textAlign: 'left',
  },

  summaryValue: {
    textAlign: 'left',
    lineHeight: 25,
  },

  /*
  ========================================================
  BALANCE
  ========================================================
  */

  balanceCard: {
    padding: 16,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },

  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  balanceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  balanceLabel: {
    textAlign: 'left',
  },

  balanceValue: {
    color: colors.primary,
    lineHeight: 20,
  },

  entryCount: {
    color: colors.subText,
  },

  /*
  ========================================================
  SECTION HEADER
  ========================================================
  */

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionHint: {
    color: colors.subText,
  },

  /*
  ========================================================
  FARM ACCOUNT TABS

  Home Screen style:
  Camera / Training / Information
  ========================================================
  */

tabContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 0,
  marginBottom: 16,
},

tabButton: {
  flex: 1,

  minHeight: 52,

  backgroundColor: colors.surface,

  borderRadius: 18,

  borderWidth: 1,
  borderColor: colors.border,

  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',

  marginHorizontal: 4,

  paddingHorizontal: 8,

  elevation: 2,

  shadowColor: colors.text,
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.06,
  shadowRadius: 3,
},

tabIconContainer: {
  width: 28,
  height: 28,
  borderRadius: 14,

  justifyContent: 'center',
  alignItems: 'center',

  marginRight: 7,

  backgroundColor: colors.border,
},

activeTabIconContainer: {
  backgroundColor: colors.glassLight,
},

tabText: {
  color: colors.text,
  fontWeight: '700',
  fontSize: 12,
  includeFontPadding: false,
},

activeTabText: {
  color: "#3b3b3b",
  fontWeight: '800',
},

  /*
  ========================================================
  TRANSACTION CARD
  ========================================================
  */

  transactionCard: {
    padding: 15,
    marginBottom: 12,
  },

  transactionTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  transactionMain: {
    flex: 1,
    minWidth: 0,
  },

  description: {
    textAlign: 'left',
    color: colors.subText,
    marginTop: 1,
  },

  amountWrap: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },

  dateText: {
    color: colors.subText,
    marginTop: 2,
  },

  transactionFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 13,
    paddingTop: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewDetailsText: {
    color: colors.primary,
    fontWeight: '600',
  },

  /*
  ========================================================
  BOTTOM ACTION BAR
  ========================================================
  */

  actionBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    flexDirection: 'row',
    gap: 10,
  },

  actionButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    backgroundColor: colors.surface,
   
  },

  expenseButton: {
    backgroundColor: colors.error,
    borderColor: '#ff0008',
  },

  incomeButton: {
    backgroundColor: colors.primary,
    borderColor: '#009d08b8',
  },

  actionExpenseText: {
    color: colors.surface,
    fontWeight: '700',
  },

  actionIncomeText: {
    color: colors.surface,
    fontWeight: '700',
  },

  /*
  ========================================================
  EMPTY
  ========================================================
  */

  empty: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    marginTop: 12,
    marginBottom: 4,
  },
});

export default FarmAccountScreen;