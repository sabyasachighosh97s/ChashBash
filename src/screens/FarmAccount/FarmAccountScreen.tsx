import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import YearMonthFilter from '@components/common/YearMonthFilter';
import AppIcon from '@components/AppIcon/AppIcon';
import {Card, Headline, Paragraph} from '@components/ui';
import {apiGet} from '../../api/client';
import {API_ROUTES} from '../../api/routes';
import {useAuth} from '../../context/AuthContext';
import colors from '@themes/colors';
import {useTranslation} from 'react-i18next';
import CustomHeader from '@components/Header/CustomHeader';
import Container from '@components/Container/Container';
import GuestAccessModal, {
  useGuestAccess,
} from '@components/common/GuestAccess';
import SideFab from '@components/AppFab/SideFab';
import {FabAction} from '@navigation/fab/fabTypes';
import Pagination from '@components/common/Pagination/Pagination';


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


/*
=========================================================
DEMO DATA
=========================================================

These are data values, not UI translations.

When API is integrated, this entire source can be replaced
by API response without changing the UI structure.
*/

const PAGE_SIZE = 10;



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
const {token} = useAuth();
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

  const [dateFilterVisible, setDateFilterVisible] = useState(false);

const [selectedYear, setSelectedYear] = useState<number | null>(null);

const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
  setCurrentPage(1);
}, [filter, selectedYear, selectedMonth]);

  /*
  =========================================================
  LOAD ENTRIES
  =========================================================
  */

const loadEntries = useCallback(async () => {
  // Guest users must not see financial data.
  if (isGuest) {
    setEntries([]);
    return;
  }

  try {
    setRefreshing(true);

    const params: Record<string, string> = {
      lang: i18n.language?.startsWith('bn') ? 'bn' : 'en',
    };

    /*
     * YEAR FILTER
     *
     * Year selected:
     * Fetch only selected year's statements.
     *
     * Year + Month selected:
     * Fetch only selected month of selected year.
     *
     * Month only:
     * Fetch all statements and filter by month locally.
     */

    if (selectedYear !== null) {
      if (selectedMonth !== null) {
        const lastDay = new Date(
          selectedYear,
          selectedMonth,
          0,
        ).getDate();

        params.start_date =
          `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01T00:00:00`;

        params.end_date =
          `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${lastDay}T23:59:59`;
      } else {
        params.start_date = `${selectedYear}-01-01T00:00:00`;
        params.end_date = `${selectedYear}-12-31T23:59:59`;
      }
    }

    console.log('FARM ACCOUNT STATEMENTS API');
    console.log('Params:', params);
    console.log('Token available:', !!token);

    const response = await apiGet(
      API_ROUTES.GET.FINANCE_STATEMENTS,
      token,
      {
        params,
      },
    );

    console.log('FARM ACCOUNT STATEMENTS RESPONSE:', response.data);

    const apiTransactions = Array.isArray(response.data)
      ? response.data
      : [];

    const normalizedEntries: FarmAccountEntry[] =
      apiTransactions.map((item: any) => {
        const rawDate =
          item.transaction_date ?? item.date ?? '';

        const parsedDate = new Date(rawDate);

        let formattedDate = String(rawDate).slice(0, 10);

        if (!Number.isNaN(parsedDate.getTime())) {
          const year = parsedDate.getFullYear();
          const month = String(
            parsedDate.getMonth() + 1,
          ).padStart(2, '0');
          const day = String(
            parsedDate.getDate(),
          ).padStart(2, '0');

          formattedDate = `${year}-${month}-${day}`;
        }

   return {
  id: String(item.id),
  type: item.transaction_type,
  category: item.category?.name ?? '',
  amount: Number(item.amount ?? 0),
  date: formattedDate,
  paymentMethod: item.payment_mode?.name ?? '',
  description: item.description ?? '',
};
      });

    setEntries(normalizedEntries);
  } catch (error: any) {
    console.log('FARM ACCOUNT API ERROR');
    console.log('Status:', error?.response?.status);
    console.log('Response:', error?.response?.data);
    console.log('Message:', error?.message);

    setEntries([]);
  } finally {
    setRefreshing(false);
  }
}, [
  isGuest,
  token,
  i18n.language,
  selectedYear,
  selectedMonth,
]);

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
  await loadEntries();
};

  const availableYears = useMemo(() => {
  const years = entries.map(item => Number(item.date.split('-')[0]));

 
  years.push(new Date().getFullYear());

  return [...new Set(years)].sort((a, b) => b - a);
}, [entries]);

/*
=========================================================
YEAR / MONTH DATE FILTER
=========================================================
*/

const dateFilteredEntries = useMemo(() => {
  return entries.filter(item => {
    const [year, month] = item.date.split('-').map(Number);

    const matchesYear =
      selectedYear === null || year === selectedYear;

    const matchesMonth =
      selectedMonth === null || month === selectedMonth;

    return matchesYear && matchesMonth;
  });
}, [entries, selectedYear, selectedMonth]);

/*
=========================================================
TOTALS
=========================================================
*/

const totals = useMemo(() => {
  const income = dateFilteredEntries
    .filter(item => item.type === 'income')
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );

  const expense = dateFilteredEntries
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
}, [dateFilteredEntries]);

  /*
  =========================================================
  FILTER
  =========================================================
  */

const filteredEntries = useMemo(
  () =>
    filter === 'all'
      ? dateFilteredEntries
      : dateFilteredEntries.filter(item => item.type === filter),
  [dateFilteredEntries, filter],
);

const totalPages = Math.ceil(
  filteredEntries.length / PAGE_SIZE,
);

const paginatedEntries = useMemo(() => {
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return filteredEntries.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );
}, [filteredEntries, currentPage]);

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

const farmAccountFabActions = useMemo<FabAction[]>(
  () => [
    {
      id: 'add-income',
      icon: 'arrow-down-circle-outline',
      label: t('add_income'),
      color: colors.success,
      route: 'FarmAccountEntry',
    },
    {
      id: 'add-expense',
      icon: 'arrow-up-circle-outline',
      label: t('add_expense'),
      color: colors.error,
      route: 'FarmAccountEntry',
    },
  ],
  [t],
);

  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <Container>
<CustomHeader
  showFilter
  onFilterPress={() => setDateFilterVisible(true)}
/>
      <FlatList
        data={paginatedEntries}
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
            {filteredEntries.length > PAGE_SIZE && (
        <View style={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={refreshing}
          />
        </View>
      )}

<YearMonthFilter
  visible={dateFilterVisible}
  selectedYear={selectedYear}
  selectedMonth={selectedMonth}
  availableYears={availableYears}
  onClose={() => setDateFilterVisible(false)}
  onApply={(year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setDateFilterVisible(false);
  }}
/>
      {/* =====================================================
          ACTION BAR
      ===================================================== */}

            <SideFab
        actions={farmAccountFabActions}
        bottom={100}
        onActionPress={action => {
          if (action.id === 'add-income') {
            openAdd('income');
          } else if (action.id === 'add-expense') {
            openAdd('expense');
          }
        }}
      />
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
  paddingBottom: 16,
},

paginationContainer: {
  paddingHorizontal: 12,
  // paddingVertical: ,
  backgroundColor: colors.background,
  alignItems: 'center',
  justifyContent: 'center',
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