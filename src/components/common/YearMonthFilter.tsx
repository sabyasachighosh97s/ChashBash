
import React, {useEffect, useMemo, useState} from 'react';

import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import AppIcon from '@components/AppIcon/AppIcon';
import {Paragraph} from '@components/ui';

import colors from '@themes/colors';

// =========================================================
// TYPES
// =========================================================

type Props = {
  visible: boolean;
  selectedYear: number | null;
  selectedMonth: number | null;
  availableYears: number[];
  onClose: () => void;
  onApply: (year: number | null, month: number | null) => void;
};

type DropdownOption = {
  label: string;
  value: number | null;
};

type DropdownType = 'year' | 'month' | null;

// =========================================================
// COMPONENT
// =========================================================

const YearMonthFilter = ({
  visible,
  selectedYear,
  selectedMonth,
  availableYears,
  onClose,
  onApply,
}: Props) => {
  const {t, i18n} = useTranslation();

  const [draftYear, setDraftYear] = useState<number | null>(
    selectedYear,
  );

  const [draftMonth, setDraftMonth] = useState<number | null>(
    selectedMonth,
  );

  const [expandedDropdown, setExpandedDropdown] =
    useState<DropdownType>(null);

  // =======================================================
  // SYNC SELECTED VALUES
  // =======================================================

  useEffect(() => {
    if (visible) {
      setDraftYear(selectedYear);
      setDraftMonth(selectedMonth);
      setExpandedDropdown(null);
    }
  }, [visible, selectedYear, selectedMonth]);

  // =======================================================
  // YEAR OPTIONS
  // =======================================================

  const yearOptions = useMemo<DropdownOption[]>(() => {
    const uniqueYears = [...new Set(availableYears)]
      .sort((a, b) => b - a);

    return [
      {
        label: t('all_years'),
        value: null,
      },
      ...uniqueYears.map(year => ({
        label: String(year),
        value: year,
      })),
    ];
  }, [availableYears, t]);

  // =======================================================
  // MONTH OPTIONS
  // =======================================================

  const monthOptions = useMemo<DropdownOption[]>(() => {
    const locale = i18n.language?.startsWith('bn')
      ? 'bn-IN'
      : 'en-IN';

    const months = Array.from(
      {length: 12},
      (_, index) => ({
        label: new Date(2020, index, 1).toLocaleDateString(
          locale,
          {month: 'long'},
        ),
        value: index + 1,
      }),
    );

    return [
      {
        label: t('all_months'),
        value: null,
      },
      ...months,
    ];
  }, [i18n.language, t]);

  // =======================================================
  // SELECTED LABELS
  // =======================================================

  const selectedYearLabel =
    yearOptions.find(item => item.value === draftYear)?.label ??
    t('all_years');

  const selectedMonthLabel =
    monthOptions.find(item => item.value === draftMonth)?.label ??
    t('all_months');

  // =======================================================
  // APPLY
  // =======================================================

  const handleApply = () => {
    setExpandedDropdown(null);
    onApply(draftYear, draftMonth);
  };

  // =======================================================
  // RESET
  // =======================================================

  const handleReset = () => {
    setDraftYear(null);
    setDraftMonth(null);
    setExpandedDropdown(null);

    onApply(null, null);
  };

  // =======================================================
  // DROPDOWN SELECT
  // =======================================================

  const handleSelect = (
    type: 'year' | 'month',
    value: number | null,
  ) => {
    if (type === 'year') {
      setDraftYear(value);
    } else {
      setDraftMonth(value);
    }

    setExpandedDropdown(null);
  };

  // =======================================================
  // DROPDOWN UI
  // =======================================================

  const renderDropdown = (
    type: 'year' | 'month',
    label: string,
    selectedLabel: string,
    options: DropdownOption[],
  ) => {
    const isExpanded = expandedDropdown === type;

    return (
      <View style={styles.dropdownWrapper}>
        <Paragraph style={styles.sectionTitle}>
          {label}
        </Paragraph>

        <Pressable
          onPress={() =>
            setExpandedDropdown(
              isExpanded ? null : type,
            )
          }
          style={[
            styles.dropdownButton,
            isExpanded && styles.dropdownButtonActive,
          ]}>

          <Paragraph
            size="sm"
            style={styles.dropdownValue}>
            {selectedLabel}
          </Paragraph>

          <AppIcon
            type="MaterialCommunityIcons"
            name={
              isExpanded
                ? 'chevron-up'
                : 'chevron-down'
            }
            size={22}
            color={colors.primary}
          />
        </Pressable>

        {isExpanded ? (
          <View style={styles.optionsContainer}>
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
              style={styles.optionsScroll}>

              {options.map((option, index) => {
                const isSelected =
                  option.value ===
                  (type === 'year'
                    ? draftYear
                    : draftMonth);

                return (
                  <Pressable
                    key={`${type}-${index}`}
                    onPress={() =>
                      handleSelect(type, option.value)
                    }
                    style={[
                      styles.option,
                      isSelected && styles.selectedOption,
                    ]}>

                    <Paragraph
                      size="sm"
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}>
                      {option.label}
                    </Paragraph>

                    {isSelected ? (
                      <AppIcon
                        type="MaterialCommunityIcons"
                        name="check"
                        size={19}
                        color={colors.primary}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
      </View>
    );
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>

      <View style={styles.overlay}>

        {/* BACKDROP */}

        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />

        {/* BOTTOM SHEET */}

        <View style={styles.sheet}>

          <View style={styles.handle} />

          {/* HEADER */}

          <View style={styles.header}>
            <View style={styles.titleSection}>

              <View style={styles.titleIcon}>
                <AppIcon
                  type="MaterialCommunityIcons"
                  name="calendar-month-outline"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <View style={styles.titleContent}>
                <Paragraph style={styles.title}>
                  {t('date_filter')}
                </Paragraph>

                <Paragraph style={styles.subtitle}>
                  {t('select_year_month')}
                </Paragraph>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              style={styles.closeButton}>

              <AppIcon
                type="MaterialCommunityIcons"
                name="close"
                size={21}
                color={colors.text}
              />
            </Pressable>
          </View>

          {/* FILTER OPTIONS */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={styles.filterScroll}>

            <View style={styles.dropdownSection}>

              {renderDropdown(
                'year',
                t('select_year'),
                selectedYearLabel,
                yearOptions,
              )}

              {renderDropdown(
                'month',
                t('select_month'),
                selectedMonthLabel,
                monthOptions,
              )}

            </View>
          </ScrollView>

          {/* FOOTER */}

          <View style={styles.footer}>

            <Pressable
              onPress={handleReset}
              style={styles.resetButton}>

              <AppIcon
                type="MaterialCommunityIcons"
                name="refresh"
                size={18}
                color={colors.text}
              />

              <Paragraph style={styles.resetText}>
                {t('reset_filter')}
              </Paragraph>
            </Pressable>

            <Pressable
              onPress={handleApply}
              style={styles.applyButton}>

              <AppIcon
                type="MaterialCommunityIcons"
                name="check-circle-outline"
                size={19}
                color={colors.textLight}
              />

              <Paragraph style={styles.applyText}>
                {t('apply_filter')}
              </Paragraph>
            </Pressable>

          </View>
        </View>
      </View>
    </Modal>
  );
};

export default YearMonthFilter;

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },

  sheet: {
    maxHeight: '75%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 26,
  },

  handle: {
    width: 42,
    height: 5,
    borderRadius: 5,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  titleIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  titleContent: {
    flex: 1,
  },

  title: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
  },

  subtitle: {
    fontSize: 12,
    color: colors.subText,
    marginTop: 3,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterScroll: {
    flexShrink: 1,
  },

  dropdownSection: {
    paddingBottom: 12,
  },

  dropdownWrapper: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 9,
  },

  dropdownButton: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownButtonActive: {
    borderColor: colors.primary,
  },

  dropdownValue: {
    color: colors.text,
    fontWeight: '600',
  },

  optionsContainer: {
    marginTop: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },

  optionsScroll: {
    maxHeight: 190,
  },

  option: {
    minHeight: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  selectedOption: {
    backgroundColor: colors.background,
  },

  optionText: {
    color: colors.text,
  },

  selectedOptionText: {
    color: colors.primary,
    fontWeight: '800',
  },

  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },

  resetButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  resetText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },

  applyButton: {
    flex: 1.5,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  applyText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '800',
  },
});
