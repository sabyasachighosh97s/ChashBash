import React, {useMemo} from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Container from '@components/Container/Container';
import DateInput from '@components/forms/DateInput';
import {
  Controller,
  useFieldArray,
  useForm,
} from 'react-hook-form';


import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import FormInput from '@components/forms/FormInput';
import FormdownInput from '@components/forms/FormdownInput';

import AppIcon from '@components/AppIcon/AppIcon';

import {CustomCard} from '@components/cards/CustomCard';
import {Rbutton} from '@components/common/Rbutton';

import {
  Paragraph,
  Headline,
} from '@components/ui';

import {CustomAppBar} from '@components/common/CustomAppBar';

import colors from '@themes/colors';

import {useTranslation} from 'react-i18next';

import type {
  FarmAccountType,
  FarmAccountEntry,
} from './FarmAccountScreen';
import CustomHeader from '@components/Header/CustomHeader';

const FARM_ACCOUNT_STORAGE_KEY =
  'FARM_ACCOUNT_ENTRIES';

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

/*
=========================================================
CATEGORY VALUES
=========================================================

Values are stable identifiers.
Labels are translated UI text.
When API comes, API can provide the display name/value.
*/

const incomeCategoryValues = [
  {
    value: 'crop_sales',
    translationKey: 'farm_crop_sales',
  },
  {
    value: 'milk_sales',
    translationKey: 'farm_milk_sales',
  },
  {
    value: 'egg_sales',
    translationKey: 'farm_egg_sales',
  },
  {
    value: 'livestock_sales',
    translationKey: 'farm_livestock_sales',
  },
  {
    value: 'government_support',
    translationKey: 'farm_government_support',
  },
  {
    value: 'other_income',
    translationKey: 'farm_other_income',
  },
];

const expenseCategoryValues = [
  {
    value: 'seed',
    translationKey: 'farm_seed',
  },
  {
    value: 'fertilizer',
    translationKey: 'farm_fertilizer',
  },
  {
    value: 'pesticide',
    translationKey: 'farm_pesticide',
  },
  {
    value: 'labour',
    translationKey: 'farm_labour',
  },
  {
    value: 'irrigation',
    translationKey: 'farm_irrigation',
  },
  {
    value: 'animal_feed',
    translationKey: 'farm_animal_feed',
  },
  {
    value: 'medicine',
    translationKey: 'farm_medicine',
  },
  {
    value: 'transport',
    translationKey: 'farm_transport',
  },
  {
    value: 'other_expense',
    translationKey: 'farm_other_expense',
  },
];

const paymentMethodValues = [
  {
    value: 'cash',
    translationKey: 'farm_cash',
  },
  {
    value: 'bank',
    translationKey: 'farm_bank',
  },
  {
    value: 'mobile_banking',
    translationKey: 'farm_mobile_banking',
  },
  {
    value: 'other',
    translationKey: 'farm_other',
  },
];

const getToday = (): string => {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const createEmptyRow = (): FormRow => ({
  category: '',
  amount: '',
  date: getToday(),
  paymentMethod: '',
  description: '',
  notes: '',
});

const generateId = (): string => {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
};

/*
=========================================================
DATE FIELD
=========================================================
*/



/*
=========================================================
SCREEN
=========================================================
*/

const FarmAccountEntryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {t} = useTranslation();

  const routeParams =
    route.params as RouteParams | undefined;

  const type: FarmAccountType =
    routeParams?.type === 'expense'
      ? 'expense'
      : 'income';

  const isIncome = type === 'income';

  /*
  =======================================================
  TRANSLATED DROPDOWN DATA
  =======================================================
  */

  const categories: DropdownOption[] = useMemo(
    () => {
      const source = isIncome
        ? incomeCategoryValues
        : expenseCategoryValues;

      return source.map(item => ({
        label: t(item.translationKey),
        value: item.value,
      }));
    },
    [isIncome, t],
  );

  const paymentMethods: DropdownOption[] =
    useMemo(
      () =>
        paymentMethodValues.map(item => ({
          label: t(item.translationKey),
          value: item.value,
        })),
      [t],
    );

  /*
  =======================================================
  FORM
  =======================================================
  */

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

  /*
  =======================================================
  SAVE
  =======================================================
  */

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

      /*
      -----------------------------------------------
      Validation
      -----------------------------------------------
      */

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

      /*
      -----------------------------------------------
      Existing entries
      -----------------------------------------------
      */

      const existingData =
        await AsyncStorage.getItem(
          FARM_ACCOUNT_STORAGE_KEY,
        );

      let existingEntries: FarmAccountEntry[] = [];

      if (existingData) {
        try {
          const parsed = JSON.parse(existingData);

          if (Array.isArray(parsed)) {
            existingEntries = parsed;
          }
        } catch {
          existingEntries = [];
        }
      }

      /*
      -----------------------------------------------
      New entries
      -----------------------------------------------
      */

      const newEntries: FarmAccountEntry[] =
        values.rows.map(row => ({
          id: generateId(),
          type,
          category: row.category,
          amount: Number(row.amount),
          date: row.date,
          paymentMethod: row.paymentMethod,
          description: row.description.trim(),
          notes: row.notes?.trim() || '',
          createdAt: new Date().toISOString(),
        }));

      const updatedEntries = [
        ...newEntries,
        ...existingEntries,
      ];

      /*
      -----------------------------------------------
      Save
      -----------------------------------------------
      */

      await AsyncStorage.setItem(
        FARM_ACCOUNT_STORAGE_KEY,
        JSON.stringify(updatedEntries),
      );

      Alert.alert(
        t('saved_successfully'),
        t('farm_account_entries_saved', {
          count: values.rows.length,
          type: t(
            isIncome
              ? 'income'
              : 'expense',
          ),
        }),
        [
          {
            text: t('ok'),
            onPress: () =>
              navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.error(
        'Farm Account save error:',
        error,
      );

      Alert.alert(
        t('save_failed'),
        t('farm_account_save_failed'),
      );
    }
  };

  /*
  =======================================================
  ADD MORE
  =======================================================
  */

  const handleAddMore = () => {
    append(createEmptyRow());
  };

  /*
  =======================================================
  REMOVE
  =======================================================
  */

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

            {/* =================================================
                ENTRY LIST
            ================================================= */}

            {fields.map(
              (field, index) => {
                const rowErrors =
                  errors.rows?.[index];

                return (
                  <View
                    key={field.id}
                    style={[
                      styles.entryCard,
                      isIncome
                        ? styles.incomeEntryCard
                        : styles.expenseEntryCard,
                    ]}>
                    <View
                      style={styles.entryHeader}>
                      <View
                        style={
                          styles.entryTitleContainer
                        }>
                        <View
                          style={[
                            styles.entryNumber,
                            isIncome
                              ? styles.entryNumberIncome
                              : styles.entryNumberExpense,
                          ]}>
                          <Paragraph
                            style={
                              styles.entryNumberText
                            }>
                            {index + 1}
                          </Paragraph>
                        </View>

                        <View>
                          <Paragraph
                            style={
                              styles.entryTitle
                            }>
                            {isIncome
                              ? t('income_details')
                              : t('expense_details')}
                          </Paragraph>

                       
                        </View>
                      </View>

                      {fields.length > 1 ? (
                        <View
                          style={
                            styles.removeContainer
                          }>
                          <Rbutton
                            title={t('remove')}
                            buttonColor={
                              colors.error
                            }
                            onPress={() =>
                              handleRemoveRow(
                                index,
                              )
                            }
                            style={
                              styles.removeButton
                            }
                          />
                        </View>
                      ) : null}
                    </View>

                    {/* CATEGORY */}

                  
                      <FormdownInput
                        control={control}
                        name={`rows.${index}.category`}
                        labelText={
                          isIncome
                            ? t('income_head')
                            : t('expense_head')
                        }
                        data={categories}
                        error={
                          rowErrors?.category
                        }
                      />
                   

                    {/* AMOUNT */}

                    
                      <FormInput
                        control={control}
                        name={`rows.${index}.amount`}
                        label={t('amount')}
                        keyboardType="decimal-pad"
                        error={
                          rowErrors?.amount
                        }
                      />
                   

                    {/* DATE */}

                   
                     
                    

                    {/* PAYMENT METHOD */}

                   <DateInput
  control={control}
  name={`rows.${index}.date`}
  label={t('date')}
  placeholder={t('date_placeholder')}
  error={rowErrors?.date}
/>
                      <FormdownInput
                        control={control}
                        name={`rows.${index}.paymentMethod`}
                        labelText={t(
                          'payment_method',
                        )}
                        data={paymentMethods}
                        error={
                          rowErrors?.paymentMethod
                        }
                      />
                   

                    {/* DESCRIPTION */}

                    
                      <FormInput
                        control={control}
                        name={`rows.${index}.description`}
                        label={t(
                          'description',
                        )}
                        multiline
                        numberOfLines={3}
                        error={
                          rowErrors?.description
                        }
                      />
                    

  
                   
                  </View>
                );
              },
            )}

            {/* =================================================
                ADD MORE
            ================================================= */}

            <View
              style={styles.addMoreContainer}>
              <Rbutton
                title={
                  isIncome
                    ? t('add_another_income')
                    : t('add_another_expense')
                }
                buttonColor={
                  isIncome
                    ? colors.success
                    : colors.error
                }
                onPress={handleAddMore}
                style={styles.addMoreButton}
              />
            </View>

            {/* =================================================
                INFO
            ================================================= */}

            <View style={styles.infoContainer}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="information-outline"
                size={19}
                color={colors.info}
              />

              <Paragraph
                style={styles.infoText}>
                {t('multiple_entries_info', {
                  type: t(
                    isIncome
                      ? 'income'
                      : 'expense',
                  ),
                })}
              </Paragraph>
            </View>

            {/* =================================================
                SAVE
            ================================================= */}

            <View
              style={styles.actionContainer}>
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
                onPress={handleSubmit(
                  handleSave,
                )}
                style={styles.submitButton}
                disabled={isSubmitting}
              />
            </View>
          </CustomCard>
        </ScrollView>
      </KeyboardAvoidingView>
</Container>  );
};

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
    // paddingTop: 8,
    // paddingBottom: 8,
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

  addMoreContainer: {
    marginHorizontal: 12,
    marginTop: 2,
    marginBottom: 16,
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
});

export default FarmAccountEntryScreen;