
import React, {useEffect, useMemo, useState} from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
   Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  Controller,
  useFieldArray,
  useForm,
} from 'react-hook-form';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import FormInput from '@components/forms/FormInput';
import FormdownInput from '@components/forms/FormdownInput';
import DateInput from '@components/forms/DateInput';

import AppIcon from '@components/AppIcon/AppIcon';
import {CustomCard} from '@components/cards/CustomCard';
import {Rbutton} from '@components/common/Rbutton';

import {
  Paragraph,
} from '@components/ui';

import colors from '@themes/colors';
import {useTranslation} from 'react-i18next';

import Container from '@components/Container/Container';
import CustomHeader from '@components/Header/CustomHeader';

import type {
  FarmAccountType,
} from './FarmAccountScreen';

import {apiGet, apiPost} from '../../api/client';
import {API_ROUTES} from '../../api/routes';
import {useAuth} from '../../context/AuthContext';

// =========================================================
// TYPES
// =========================================================

type FormRow = {
  category: string;
  amount: string;
  date: string;
  paymentMethod: string;
  description: string;
  notes: string;
};

type FormValues = {
  rows: FormRow[];
};

type RouteParams = {
  type?: FarmAccountType;
};

type DropdownOption = {
  label: string;
  value: string;
};

type FinanceCategory = {
  id: string;
  type: 'income' | 'expense';
  code: string;
  name: string;
};

// =========================================================
// PAYMENT METHODS
// Existing UI options preserved.
// Backend POST contract does not currently
// contain a payment_method field.
// =========================================================
type PaymentModeCategory = {
  id: string;
  type: 'payment_mode';
  code: string;
  name: string;
};


// =========================================================
// DATE
// =========================================================
const getToday = (): string => {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
// =========================================================
// EMPTY ROW
// =========================================================

const createEmptyRow = (): FormRow => ({
  category: '',
  amount: '',
date: getToday(),
  paymentMethod: '',
  description: '',
  notes: '',
});

const convertFormDateToApiDate = (
  value: string,
): string => {
  const [day, month, year] = value.split('/');

  return `${year}-${month}-${day}T00:00:00`;
};

// =========================================================
// SCREEN
// =========================================================

const FarmAccountEntryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {t, i18n} = useTranslation();

  // Auth token from existing AuthContext
  const {token} = useAuth();

  const routeParams =
    route.params as RouteParams | undefined;

  const type: FarmAccountType =
    routeParams?.type === 'expense'
      ? 'expense'
      : 'income';

      console.log('FARM ACCOUNT ROUTE PARAMS:', route.params);
console.log('SELECTED TRANSACTION TYPE:', type);

  const isIncome = type === 'income';

  // =======================================================
  // CATEGORY API STATE
  // =======================================================

  const [categories, setCategories] = useState<
    DropdownOption[]
  >([]);

  const [paymentMethods, setPaymentMethods] = useState<
  DropdownOption[]
>([]);

const [paymentMethodsLoading, setPaymentMethodsLoading] =
  useState(false);

  const [categoriesLoading, setCategoriesLoading] =
    useState(false);

  // =======================================================
  // LOAD CATEGORY API
  // =======================================================

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        setCategories([]);

        console.log('================================');
        console.log('FARM ACCOUNT CATEGORY API');
        console.log('Transaction type:', type);
        console.log('Token available:', !!token);
        console.log('================================');

        const response = await apiGet(
          API_ROUTES.GET.FINANCE_CATEGORIES,
          token,
          {
            params: {
              type,
              lang: i18n.language?.startsWith('bn')
                ? 'bn'
                : 'en',
            },
          },
        );

        console.log(
          'FARM ACCOUNT CATEGORY RESPONSE:',
          response.data,
        );

        // Backend response is a direct array.
        const apiCategories: FinanceCategory[] =
          Array.isArray(response.data)
            ? response.data
            : [];

        const dropdownOptions: DropdownOption[] =
          apiCategories.map(item => ({
            label: item.name,
            value: item.id,
          }));

        if (isMounted) {
          setCategories(dropdownOptions);
        }
      } catch (error: any) {
        console.log('FARM ACCOUNT CATEGORY API ERROR');
        console.log('Status:', error?.response?.status);
        console.log('Response:', error?.response?.data);
        console.log('Message:', error?.message);

        if (isMounted) {
          setCategories([]);

          Alert.alert(
            t('error'),
            t('something_went_wrong'),
          );
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, [type, token, i18n.language, t]);

  // =======================================================
// LOAD PAYMENT MODE API
// =======================================================

useEffect(() => {
  let isMounted = true;

  const loadPaymentMethods = async () => {
    try {
      setPaymentMethodsLoading(true);
      setPaymentMethods([]);

      const response = await apiGet(
        API_ROUTES.GET.FINANCE_CATEGORIES,
        token,
        {
          params: {
            type: 'payment_mode',
            lang: i18n.language?.startsWith('bn')
              ? 'bn'
              : 'en',
          },
        },
      );

      console.log(
        'FARM ACCOUNT PAYMENT MODE RESPONSE:',
        response.data,
      );

      const apiPaymentModes: PaymentModeCategory[] =
        Array.isArray(response.data)
          ? response.data
          : [];

      const dropdownOptions: DropdownOption[] =
        apiPaymentModes.map(item => ({
          label: item.name,
          value: item.id,
        }));

      if (isMounted) {
        setPaymentMethods(dropdownOptions);
      }
    } catch (error: any) {
      console.log('PAYMENT MODE API ERROR');
      console.log('Status:', error?.response?.status);
      console.log('Response:', error?.response?.data);
      console.log('Message:', error?.message);

      if (isMounted) {
        setPaymentMethods([]);
      }
    } finally {
      if (isMounted) {
        setPaymentMethodsLoading(false);
      }
    }
  };

  loadPaymentMethods();

  return () => {
    isMounted = false;
  };
}, [token, i18n.language]);

  // =======================================================
  // PAYMENT METHOD OPTIONS
  // =======================================================


  // =======================================================
  // FORM
  // =======================================================

  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    defaultValues: {
      rows: [createEmptyRow()],
    },
    mode: 'onChange',
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'rows',
  });

  // =======================================================
  // SAVE TRANSACTIONS API
  // One POST request per row.
  // =======================================================

  const handleSave = async (
    values: FormValues,
  ) => {
    try {
      if (!values.rows.length) {
        Alert.alert(
          t('no_entry'),
          t(
            isIncome
              ? 'please_add_income_entry'
              : 'please_add_expense_entry',
          ),
        );

        return;
      }

      if (!token) {
        Alert.alert(
          t('error'),
          t('something_went_wrong'),
        );

        return;
      }

      // ===================================================
      // VALIDATION
      // Existing validation preserved.
      // ===================================================

      for (
        let index = 0;
        index < values.rows.length;
        index++
      ) {
        const row = values.rows[index];

        const amount = Number(row.amount);

        if (!row.category?.trim()) {
          Alert.alert(
            t('required_field'),
            t(
              isIncome
                ? 'select_income_head_entry'
                : 'select_expense_head_entry',
              {
                index: index + 1,
              },
            ),
          );

          return;
        }

        if (!row.date?.trim()) {
          Alert.alert(
            t('required_field'),
            t('enter_date_entry', {
              index: index + 1,
            }),
          );

          return;
        }

        if (
          !Number.isFinite(amount) ||
          amount <= 0
        ) {
          Alert.alert(
            t('invalid_amount'),
            t('enter_valid_amount_entry', {
              index: index + 1,
            }),
          );

          return;
        }

        if (!row.paymentMethod?.trim()) {
          Alert.alert(
            t('required_field'),
            t('select_payment_method_entry', {
              index: index + 1,
            }),
          );

          return;
        }

        if (!row.description?.trim()) {
          Alert.alert(
            t('required_field'),
            t('enter_description_entry', {
              index: index + 1,
            }),
          );

          return;
        }
      }

      // ===================================================
      // CATEGORY VALIDATION
      // ===================================================

      for (let index = 0; index < values.rows.length; index++) {
        const categoryExists = categories.some(
          item => item.value === values.rows[index].category,
        );

        if (!categoryExists) {
          Alert.alert(
            t('required_field'),
            t(
              isIncome
                ? 'select_income_head_entry'
                : 'select_expense_head_entry',
              {
                index: index + 1,
              },
            ),
          );

          return;
        }
      }

      // ===================================================
      // CREATE TRANSACTIONS
      // ===================================================

      const language = i18n.language?.startsWith('bn')
        ? 'bn'
        : 'en';

      let savedCount = 0;

      console.log('================================');
      console.log('FARM ACCOUNT TRANSACTION POST');
      console.log('Transaction type:', type);
      console.log('Total rows:', values.rows.length);
      console.log('================================');

      for (const row of values.rows) {
     const payload = {
  category_id: row.category,
  transaction_type: type,
  amount: Number(row.amount),
  description: row.description.trim(),
  transaction_date: convertFormDateToApiDate(row.date),
  payment_mode_id: row.paymentMethod,
};
        console.log(
          'TRANSACTION REQUEST:',
          payload,
        );
console.log('FINAL TRANSACTION PAYLOAD:', payload);
        const response = await apiPost(
          API_ROUTES.POST.FINANCE_TRANSACTIONS,
          payload,
          token,
          {
            params: {
              lang: language,
            },
          },
        );

        console.log(
          'TRANSACTION RESPONSE:',
          response.data,
        );

        savedCount++;
      }

      // ===================================================
      // SUCCESS
      // ===================================================

      Alert.alert(
        t('saved_successfully'),
        t('farm_account_entries_saved', {
          count: savedCount,
          type: t(
            isIncome
              ? 'income'
              : 'expense',
          ),
        }),
        [
          {
            text: t('ok'),
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      console.log('================================');
      console.log('FARM ACCOUNT SAVE API ERROR');
      console.log('Status:', error?.response?.status);
      console.log('Response:', error?.response?.data);
      console.log('Message:', error?.message);
      console.log('================================');

      Alert.alert(
        t('save_failed'),
        error?.response?.data?.detail ??
          error?.response?.data?.message ??
          t('farm_account_save_failed'),
      );
    }
  };

  // =======================================================
  // ADD MORE
  // =======================================================

  const handleAddMore = () => {
    append(createEmptyRow());
  };

  // =======================================================
  // REMOVE
  // =======================================================

  const handleRemoveRow = (
    index: number,
  ) => {
    if (fields.length === 1) {
      Alert.alert(
        t('cannot_remove'),
        t('at_least_one_entry_required'),
      );

      return;
    }

    Alert.alert(
      t('remove_entry'),
      t('remove_entry_confirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('remove'),
          style: 'destructive',
          onPress: () => remove(index),
        },
      ],
    );
  };

  // =======================================================
  // UI
  // Existing UI structure preserved.
  // =======================================================

  return (
    <Container>
      <CustomHeader />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <CustomCard style={styles.mainCard}>

            <View
              style={[
                styles.typeBadge,
                isIncome
                  ? styles.incomeBadge
                  : styles.expenseBadge,
              ]}>
              <AppIcon
                type="MaterialCommunityIcons"
                name={
                  isIncome
                    ? 'arrow-down-circle-outline'
                    : 'arrow-up-circle-outline'
                }
                size={16}
                color={
                  isIncome
                    ? colors.success
                    : colors.error
                }
              />

              <Paragraph
                style={[
                  styles.typeBadgeText,
                  {
                    color: isIncome
                      ? colors.success
                      : colors.error,
                  },
                ]}>
                {isIncome
                  ? t('income_transaction')
                  : t('expense_transaction')}
              </Paragraph>
            </View>

            {/* ENTRY LIST */}

            {fields.map((field, index) => {
              const rowErrors = errors.rows?.[index];

              return (
                <View
                  key={field.id}
                  style={[
                    styles.entryCard,
                    isIncome
                      ? styles.incomeEntryCard
                      : styles.expenseEntryCard,
                  ]}>

                  <View style={styles.entryHeader}>
                    <View
                      style={styles.entryTitleContainer}>
                      <View
                        style={[
                          styles.entryNumber,
                          isIncome
                            ? styles.entryNumberIncome
                            : styles.entryNumberExpense,
                        ]}>
                        <Paragraph
                          style={styles.entryNumberText}>
                          {index + 1}
                        </Paragraph>
                      </View>

                      <View>
                        <Paragraph
                          style={styles.entryTitle}>
                          {isIncome
                            ? t('income_details')
                            : t('expense_details')}
                        </Paragraph>
                      </View>
                    </View>

                    {fields.length > 1 ? (
                      <View style={styles.removeContainer}>
                        <Rbutton
                          title={t('remove')}
                          buttonColor={colors.error}
                          onPress={() =>
                            handleRemoveRow(index)
                          }
                          style={styles.removeButton}
                        />
                      </View>
                    ) : null}
                  </View>

                  {/* CATEGORY FROM API */}

                  <FormdownInput
                    control={control}
                    name={`rows.${index}.category`}
                    labelText={
                      isIncome
                        ? t('income_head')
                        : t('expense_head')
                    }
                    data={categories}
                    disabled={
                      categoriesLoading ||
                      categories.length === 0
                    }
                    error={rowErrors?.category}
                  />

                  {/* AMOUNT */}

                  <FormInput
                    control={control}
                    name={`rows.${index}.amount`}
                    label={t('amount')}
                    keyboardType="decimal-pad"
                    error={rowErrors?.amount}
                  />
                  

                  {/* DATE */}

 <DateInput
  control={control}
  name={`rows.${index}.date`}
  label={t('date')}
  placeholder={t('date_placeholder')}
  error={rowErrors?.date}
  maximumDate={new Date()}
/>

                  {/* PAYMENT METHOD */}

                <FormdownInput
  control={control}
  name={`rows.${index}.paymentMethod`}
  labelText={t('payment_method')}
  data={paymentMethods}
  disabled={
    paymentMethodsLoading ||
    paymentMethods.length === 0
  }
  error={rowErrors?.paymentMethod}
/>

                  {/* DESCRIPTION */}

                  <FormInput
                    control={control}
                    name={`rows.${index}.description`}
                    label={t('description')}
                    multiline
                    numberOfLines={3}
                    error={rowErrors?.description}
                  />

                </View>
              );
            })}

            {/* ADD MORE */}

          <View style={styles.addMoreContainer}>
  <Pressable
    onPress={handleAddMore}
    style={({pressed}) => [
      styles.addMoreAction,
      pressed && {opacity: 0.7},
    ]}>

    <AppIcon
      type="MaterialCommunityIcons"
      name="plus-circle-outline"
      size={22}
      color={isIncome ? colors.success : colors.error}
    />

    <Paragraph style={[
      styles.addMoreText,
      {
        color: isIncome ? colors.success : colors.error,
      },
    ]}>
      {isIncome
        ? t('add_another_income')
        : t('add_another_expense')}
    </Paragraph>

  </Pressable>
</View>

            {/* INFO */}

            <View style={styles.infoContainer}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="information-outline"
                size={19}
                color={colors.info}
              />

              <Paragraph style={styles.infoText}>
                {t('multiple_entries_info', {
                  type: t(
                    isIncome
                      ? 'income'
                      : 'expense',
                  ),
                })}
              </Paragraph>
            </View>

            {/* SAVE */}

            <View style={styles.actionContainer}>
              <Rbutton
                title={
                  isSubmitting
                    ? t('saving')
                    : isIncome
                    ? t('save_income')
                    : t('save_expense')
                }
                buttonColor={
                  isIncome
                    ? colors.success
                    : colors.error
                }
                onPress={handleSubmit(handleSave)}
                style={styles.submitButton}
             disabled={
  isSubmitting ||
  categoriesLoading ||
  categories.length === 0 ||
  paymentMethodsLoading ||
  paymentMethods.length === 0
}
              />
            </View>

          </CustomCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default FarmAccountEntryScreen;

// =========================================================
// STYLES
// Existing styles preserved.
// =========================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  flex: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },

  mainCard: {
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  headerIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  incomeIconContainer: {
    backgroundColor: colors.border,
  },

  expenseIconContainer: {
    backgroundColor: colors.border,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 3,
  },

  subTitle: {
    fontSize: 13,
    opacity: 0.7,
    alignSelf: 'flex-start',
  },

  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  incomeBadge: {
    backgroundColor: colors.border,
  },

  expenseBadge: {
    backgroundColor: colors.border,
  },

  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },

  entryCard: {
    marginHorizontal: 8,
    marginBottom: 18,
    padding: 10,
    borderRadius: 18,
    borderWidth: 1,
  },

  incomeEntryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.success,
  },

  expenseEntryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.error,
  },

  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  entryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  entryNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  entryNumberIncome: {
    backgroundColor: colors.border,
  },

  entryNumberExpense: {
    backgroundColor: colors.border,
  },

  entryNumberText: {
    fontSize: 13,
    fontWeight: '800',
  },

  entryTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  entrySubTitle: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },

  removeContainer: {
    marginLeft: 8,
  },

  removeButton: {
    borderRadius: 8,
    minWidth: 75,
  },

  fieldWrapper: {
    width: '100%',
  },

  dateInput: {
    backgroundColor: colors.surface,
  },

  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

 

  addMoreButton: {
    borderRadius: 10,
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 13,
    backgroundColor: colors.border,
    borderRadius: 12,
  },

  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  actionContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  submitButton: {
    borderRadius: 10,
  },

  addMoreAction: {
  minHeight: 54,
  borderWidth: 1,
  borderColor: colors.success,
  borderRadius: 12,
  backgroundColor: colors.surface,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 9,
},

addMoreText: {
  fontSize: 14,
  fontWeight: '700',
},

addMoreContainer: {
  marginHorizontal: 12,
  marginTop: 2,
  marginBottom: 16,
},
});
