import React, {memo} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Headline,
  Paragraph,
} from '@components/ui';

import AppIcon from '@components/AppIcon/AppIcon';

import useThemeMode from '@hook/useThemeMode';
import colors from '@themes/colors';

export type InputFilterItem = {
  label: string;
  value: string | number;
};

type Props = {
  title?: string;
  items: InputFilterItem[];
  selectedValue?: string | number;
  onSelect: (item: InputFilterItem) => void;
};

const getCategoryIcon = (
  value: string | number,
) => {
  switch (String(value)) {
    case 'fertilizer':
      return 'eco';

    case 'seed':
      return 'spa';

    case 'pesticide':
      return 'bug-report';

    case 'equipment':
      return 'build';

    case 'all':
    default:
      return 'apps';
  }
};

const InputCategoryFilter = ({
  title = 'কৃষি উপকরণ',
  items,
  selectedValue,
  onSelect,
}: Props) => {
  const {theme} = useThemeMode();

  const themeColors = theme.colors;

  return (
    <View style={styles.container}>

      {/* ============================================================
          Header
      ============================================================ */}

      <View style={styles.headerRow}>

        <View style={styles.titleWrapper}>

          <View
            style={[
              styles.titleIcon,
              {
                backgroundColor:
                  `${colors.primary}10`,
              },
            ]}>
            <AppIcon
              type="MaterialIcons"
              name="category"
              size={18}
              color={colors.primary}
            />
          </View>

          <View>
            <Headline
              size="sm"
              textColor={
                themeColors.text ??
                colors.text
              }
              style={styles.title}>
              {title}
            </Headline>

            <Paragraph
              size="xs"
              textColor={
                themeColors
                  .onSurfaceVariant ??
                colors.subText
              }>
              আপনার প্রয়োজন অনুযায়ী বেছে নিন
            </Paragraph>
          </View>

        </View>

      </View>

      {/* ============================================================
          Category Chips
      ============================================================ */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }>

        {items.map(item => {
          const isSelected =
            String(selectedValue ?? '') ===
            String(item.value);

          const iconName =
            getCategoryIcon(
              item.value,
            );

          return (
            <TouchableOpacity
              key={String(item.value)}
              activeOpacity={0.82}
              onPress={() =>
                onSelect(item)
              }
              style={[
                styles.chip,
                {
                  backgroundColor:
                    isSelected
                      ? colors.primary
                      : themeColors.surface ??
                        colors.surface,

                  borderColor:
                    isSelected
                      ? colors.primary
                      : themeColors.border ??
                        colors.border,
                },
              ]}>

              {/* Icon */}

              <View
                style={[
                  styles.chipIcon,
                  {
                    backgroundColor:
                      isSelected
                        ? `${colors.accent}22`
                        : `${colors.primary}0C`,
                  },
                ]}>

                <AppIcon
                  type="MaterialIcons"
                  name={iconName}
                  size={17}
                  color={
                    isSelected
                      ? colors.accent
                      : colors.primary
                  }
                />

              </View>

              {/* Label */}

              <Paragraph
                size="xs"
                numberOfLines={1}
                textColor={
                  isSelected
                    ? colors.textLight
                    : themeColors.text ??
                      colors.text
                }
                style={
                  styles.chipText
                }>
                {item.label}
              </Paragraph>

              {/* Selected */}

              {isSelected && (
                <View
                  style={
                    styles.checkWrapper
                  }>
                  <AppIcon
                    type="MaterialIcons"
                    name="check"
                    size={14}
                    color={
                      colors.textLight
                    }
                  />
                </View>
              )}

            </TouchableOpacity>
          );
        })}

      </ScrollView>
    </View>
  );
};

export default memo(
  InputCategoryFilter,
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  headerRow: {
    marginBottom: 10,
  },

  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleIcon: {
    width: 38,
    height: 38,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 9,
  },

  title: {
    lineHeight: 21,
  },

  scrollContent: {
    paddingRight: 16,
    paddingBottom: 2,
  },

  chip: {
    minHeight: 46,

    borderRadius: 23,

    borderWidth: 1,

    paddingHorizontal: 8,
    paddingRight: 13,

    marginRight: 8,

    flexDirection: 'row',
    alignItems: 'center',
  },

  chipIcon: {
    width: 30,
    height: 30,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 7,
  },

  chipText: {
    lineHeight: 18,

    maxWidth: 105,

    fontWeight: '600',
  },

  checkWrapper: {
    width: 20,
    height: 20,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 6,
  },
});