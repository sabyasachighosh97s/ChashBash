import React, {useMemo, useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';
import {TextInput, useTheme} from 'react-native-paper';
import colors from '@themes/colors';

type DateInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  error?: FieldError;
  minimumDate?: Date;
  maximumDate?: Date;
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatFormDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const formatDisplayDate = (date: Date): string => {
  return `${String(date.getDate()).padStart(2, '0')} ${
    MONTHS[date.getMonth()]
  } ${date.getFullYear()}`;
};

const parseDate = (value?: string): Date | null => {
  if (!value) {
    return null;
  }

  const parts = value.split('/');

  if (parts.length !== 3) {
    return null;
  }

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isBeforeDay = (date: Date, minimumDate?: Date): boolean => {
  if (!minimumDate) {
    return false;
  }

  return startOfDay(date).getTime() < startOfDay(minimumDate).getTime();
};

const isAfterDay = (date: Date, maximumDate?: Date): boolean => {
  if (!maximumDate) {
    return false;
  }

  return startOfDay(date).getTime() > startOfDay(maximumDate).getTime();
};

const isDateDisabled = (
  date: Date,
  minimumDate?: Date,
  maximumDate?: Date,
): boolean => {
  return (
    isBeforeDay(date, minimumDate) || isAfterDay(date, maximumDate)
  );
};

const getCalendarDays = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const firstWeekDay = firstDay.getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: Date[] = [];

  for (let index = 0; index < firstWeekDay; index += 1) {
    days.push(new Date(year, month, -firstWeekDay + index + 1));
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }

  const remainingDays = 42 - days.length;

  for (let day = 1; day <= remainingDays; day += 1) {
    days.push(new Date(year, month + 1, day));
  }

  return days;
};

export default function DateInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  error,
  minimumDate,
  maximumDate,
}: DateInputProps<T>) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const today = useMemo(() => startOfDay(new Date()), []);

  const {height} = useWindowDimensions();

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange}}) => {
        const selectedDate = parseDate(value);

        const displayValue = selectedDate
          ? formatDisplayDate(selectedDate)
          : '';

        const openPicker = () => {
          setOpen(true);
        };

        return (
          <View style={styles.container}>
         <TextInput
  mode="outlined"
  label={label}
  placeholder={placeholder}
  value={displayValue}
  editable={false}
  onPressIn={openPicker}
  showSoftInputOnFocus={false}
  error={!!error}
  right={
    <TextInput.Icon
      icon="calendar-month-outline"
      onPress={openPicker}
    />
  }
  outlineColor={error ? theme.colors.error : theme.colors.outline}
  activeOutlineColor={
    error ? theme.colors.error : theme.colors.primary
  }
  textColor={theme.colors.onSurface}
  placeholderTextColor={theme.colors.outline}
  selectionColor={error ? theme.colors.error : theme.colors.primary}
  style={[
    styles.input,
    {
      backgroundColor: theme.colors.surface,
    },
  ]}
  contentStyle={{
    ...styles.inputContent,
    color: theme.colors.onSurface,
  }}
  theme={{
    colors: {
      text: theme.colors.onSurface,
      primary: error ? theme.colors.error : theme.colors.primary,
      placeholder: theme.colors.outline,
    },
  }}
  outlineStyle={{
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: error ? theme.colors.error : theme.colors.outline,
  }}
/>

            <DateCalendarModal
              visible={open}
              initialDate={selectedDate ?? today}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              height={height}
              onCancel={() => {
                setOpen(false);
              }}
              onConfirm={(date: Date) => {
                onChange(formatFormDate(date));
                setOpen(false);
              }}
            />
          </View>
        );
      }}
    />
  );
}

type DateCalendarModalProps = {
  visible: boolean;
  initialDate: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  height: number;
  onCancel: () => void;
  onConfirm: (date: Date) => void;
};

function DateCalendarModal({
  visible,
  initialDate,
  minimumDate,
  maximumDate,
  height,
  onCancel,
  onConfirm,
}: DateCalendarModalProps) {
      const today = useMemo(() => startOfDay(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const [displayMonth, setDisplayMonth] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  const calendarDays = useMemo(
    () =>
      getCalendarDays(
        displayMonth.getFullYear(),
        displayMonth.getMonth(),
      ),
    [displayMonth],
  );

  const goToPreviousMonth = () => {
    setDisplayMonth(
      current => new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1,
      ),
    );
  };

  const goToNextMonth = () => {
    setDisplayMonth(
      current => new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        1,
      ),
    );
  };

  const isPreviousMonthDisabled = useMemo(() => {
    if (!minimumDate) {
      return false;
    }

    const previousMonth = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() - 1,
      1,
    );

    const minimumMonth = new Date(
      minimumDate.getFullYear(),
      minimumDate.getMonth(),
      1,
    );

    return previousMonth < minimumMonth;
  }, [displayMonth, minimumDate]);

  const isNextMonthDisabled = useMemo(() => {
    if (!maximumDate) {
      return false;
    }

    const nextMonth = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() + 1,
      1,
    );

    const maximumMonth = new Date(
      maximumDate.getFullYear(),
      maximumDate.getMonth(),
      1,
    );

    return nextMonth > maximumMonth;
  }, [displayMonth, maximumDate]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.dialog,
            {
              maxHeight: Math.min(height * 0.72, 560),
            },
          ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <Text style={styles.headerLabel}>{'Date'}</Text>

              <Pressable
                onPress={onCancel}
                hitSlop={12}
                style={styles.closeButton}>
                <Text style={styles.closeIcon}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.headerDate}>
              {formatDisplayDate(selectedDate)}
            </Text>
          </View>

          {/* Month navigation */}
          <View style={styles.monthHeader}>
            <Text style={styles.monthTitle}>
              {MONTHS[displayMonth.getMonth()]}{' '}
              {displayMonth.getFullYear()}
            </Text>

            <View style={styles.monthActions}>
              <Pressable
                onPress={goToPreviousMonth}
                disabled={isPreviousMonthDisabled}
                style={[
                  styles.arrowButton,
                  isPreviousMonthDisabled &&
                    styles.disabledArrowButton,
                ]}>
                <Text
                  style={[
                    styles.arrowText,
                    isPreviousMonthDisabled &&
                      styles.disabledArrowText,
                  ]}>
                  ‹
                </Text>
              </Pressable>

              <Pressable
                onPress={goToNextMonth}
                disabled={isNextMonthDisabled}
                style={[
                  styles.arrowButton,
                  isNextMonthDisabled &&
                    styles.disabledArrowButton,
                ]}>
                <Text
                  style={[
                    styles.arrowText,
                    isNextMonthDisabled &&
                      styles.disabledArrowText,
                  ]}>
                  ›
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Calendar */}
          <View style={styles.calendar}>
            <View style={styles.weekRow}>
              {WEEK_DAYS.map(day => (
                <View key={day} style={styles.weekCell}>
                  <Text style={styles.weekText}>{day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.daysContainer}>
              {calendarDays.map((date, index) => {
                const isCurrentMonth =
                  date.getMonth() === displayMonth.getMonth();

                const selected = isSameDay(date, selectedDate);

                const disabled = isDateDisabled(
                  date,
                  minimumDate,
                  maximumDate,
                );

                const todayDate = isSameDay(date, today);

                return (
                  <View key={`${date.toISOString()}-${index}`} style={styles.dayCell}>
                    <Pressable
                      disabled={disabled}
                      onPress={() => {
                        setSelectedDate(date);
                      }}
                      style={[
                        styles.dayButton,
                        selected && styles.selectedDayButton,
                        todayDate &&
                          !selected &&
                          styles.todayDayButton,
                      ]}>
                      <Text
                        style={[
                          styles.dayText,
                          !isCurrentMonth &&
                            styles.outsideMonthText,
                          disabled && styles.disabledDayText,
                          selected && styles.selectedDayText,
                        ]}>
                        {date.getDate()}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              onPress={onCancel}
              style={styles.footerButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                onConfirm(selectedDate);
              }}
              style={styles.okButton}>
              <Text style={styles.okText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  input: {
    width: '100%',
    backgroundColor: colors.surface,
    marginVertical: 8,
  },

  inputContent: {
    minHeight: 52,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backdrop,
    paddingHorizontal: 18,
  },

  dialog: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 14,
  },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 18,
  },

  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLabel: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.85,
  },

  headerDate: {
    color: colors.textLight,
    fontSize: 27,
    fontWeight: '700',
    marginTop: 8,
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeIcon: {
    color: colors.textLight,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '300',
  },

  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 10,
  },

  monthTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },

  monthActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  arrowText: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: '400',
    lineHeight: 36,
  },

  disabledArrowButton: {
    opacity: 0.35,
  },

  disabledArrowText: {
    color: colors.disabled,
  },

  calendar: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },

  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  weekCell: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  weekText: {
    color: colors.subText,
    fontSize: 12,
    fontWeight: '600',
  },

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayCell: {
    width: '14.2857%',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  todayDayButton: {
    borderWidth: 1,
    borderColor: colors.primary,
  },

  selectedDayButton: {
    backgroundColor: colors.primary,
  },

  dayText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },

  selectedDayText: {
    color: colors.textLight,
    fontWeight: '700',
  },

  outsideMonthText: {
    color: colors.disabled,
  },

  disabledDayText: {
    color: colors.disabled,
    opacity: 0.45,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  footerButton: {
    minWidth: 78,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  cancelText: {
    color: colors.subText,
    fontSize: 15,
    fontWeight: '600',
  },

  okButton: {
    minWidth: 70,
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  okText: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: '700',
  },
});