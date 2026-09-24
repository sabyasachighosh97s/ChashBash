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

import {InputFilterItem} from './InputCategoryFilter';

type Props = {
  title?: string;
  items: InputFilterItem[];
  selectedValue?: string | number;
  onSelect: (item: InputFilterItem) => void;
};

const InputSubCategoryFilter = ({
  title = 'ধরন',
  items,
  selectedValue,
  onSelect,
}: Props) => {
  const {theme} = useThemeMode();

  const themeColors = theme.colors;

  if (!items.length) {
    return null;
  }

  const allItem: InputFilterItem = {
    value: 'all',
    label: 'সব',
  };

  const filterItems = [
    allItem,
    ...items,
  ];

  return (
    <View style={styles.container}>

      {/* ============================================================
          Header
      ============================================================ */}

      <View style={styles.headerRow}>

        {/* <View
          style={
            styles.titleWrapper
          }>

          <View
            style={[
              styles.titleIcon,
              {
                backgroundColor:
                  `${colors.accent}25`,
              },
            ]}>

            <AppIcon
              type="MaterialIcons"
              name="tune"
              size={18}
              color={
                colors.primary
              }
            />

          </View>

          <View>
            <Headline
              size="sm"
              textColor={
                themeColors.text ??
                colors.text
              }
              style={
                styles.title
              }>
              {title}
            </Headline>

        
          </View>

        </View> */}

      </View>

      {/* ============================================================
          Sub Category Chips
      ============================================================ */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }>

        {filterItems.map(item => {

          const isSelected =
            String(
              selectedValue ?? 'all',
            ) ===
            String(item.value);

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
                      ? `${colors.primary}10`
                      : themeColors.surface ??
                        colors.surface,

                  borderColor:
                    isSelected
                      ? colors.primary
                      : themeColors.border ??
                        colors.border,
                },
              ]}>

              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      isSelected
                        ? colors.primary
                        : `${colors.primary}25`,
                  },
                ]}
              />

              <Paragraph
                size="xs"
                numberOfLines={1}
                textColor={
                  isSelected
                    ? colors.primary
                    : themeColors.text ??
                      colors.text
                }
                style={
                  styles.chipText
                }>
                {item.label}
              </Paragraph>

              {isSelected && (
                <AppIcon
                  type="MaterialIcons"
                  name="check"
                  size={16}
                  color={
                    colors.primary
                  }
                  style={
                    styles.checkIcon
                  }
                />
              )}

            </TouchableOpacity>
          );
        })}

      </ScrollView>
    </View>
  );
};

export default memo(
  InputSubCategoryFilter,
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },

  headerRow: {
    marginBottom: 9,
  },

  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleIcon: {
    width: 36,
    height: 36,

    borderRadius: 11,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 9,
  },

  title: {
    lineHeight: 21,
  },

  scrollContent: {
    paddingRight: 16,
  },

  chip: {
    minHeight: 42,

    borderRadius: 21,

    borderWidth: 1,

    paddingHorizontal: 12,

    marginRight: 8,

    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 7,
  },

  chipText: {
    lineHeight: 18,

    maxWidth: 125,

    fontWeight: '600',
  },

  checkIcon: {
    marginLeft: 6,
  },
});