import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import AppIcon from '@components/AppIcon/AppIcon';
import { Paragraph } from '@components/ui';
import useThemeMode from '@hook/useThemeMode';
import colors from '@themes/colors';
import i18n from 'src/localization/i18n';
import i18next from 'i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) => {
  const { theme } = useThemeMode();

  const pages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1,
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }, [currentPage, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (page: number) => {
    if (
      loading ||
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    onPageChange(page);
  };

  const toBanglaNumber = (value: number) => {
  const banglaDigits = '০১২৩৪৫৬৭৮৯';

  return value
    .toString()
    .split('')
    .map(digit => banglaDigits[Number(digit)] ?? digit)
    .join('');
};

  return (
    <View style={styles.container}>
      {/* First Page */}
      <TouchableOpacity
        activeOpacity={0.75}
        disabled={isFirstPage || loading}
        onPress={() => handlePageChange(1)}
        style={[
          styles.navigationButton,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            opacity:
              isFirstPage || loading
                ? 0.35
                : 1,
          },
        ]}
      >
        <AppIcon
          type="MaterialCommunityIcons"
          name="page-first"
          size={21}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      {/* Previous */}
      <TouchableOpacity
        activeOpacity={0.75}
        disabled={isFirstPage || loading}
        onPress={() => handlePageChange(currentPage - 1)}
        style={[
          styles.navigationButton,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            opacity:
              isFirstPage || loading
                ? 0.35
                : 1,
          },
        ]}
      >
        <AppIcon
          type="MaterialCommunityIcons"
          name="chevron-left"
          size={22}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      {/* Page Numbers */}
      <View
        style={[
          styles.pagesContainer,
          {
            backgroundColor: theme.colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        {pages.map(page => {
          const isActive = page === currentPage;

          return (
            <TouchableOpacity
              key={page}
              activeOpacity={0.75}
              disabled={loading}
              onPress={() => handlePageChange(page)}
              style={[
                styles.pageButton,
                {
                  backgroundColor: isActive
                    ? colors.primary
                    : 'transparent',
                  borderColor: isActive
                    ? colors.primary
                    : 'transparent',
                  opacity: loading ? 0.5 : 1,
                },
              ]}
            >
            <Paragraph
  size="sm"
  style={[
    styles.pageText,
    {
      color: isActive
        ? colors.textLight
        : colors.text,
    },
  ]}
>
  {i18next.language === 'bn'
    ? toBanglaNumber(page)
    : page}
</Paragraph>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Next */}
      <TouchableOpacity
        activeOpacity={0.75}
        disabled={isLastPage || loading}
        onPress={() => handlePageChange(currentPage + 1)}
        style={[
          styles.navigationButton,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            opacity:
              isLastPage || loading
                ? 0.35
                : 1,
          },
        ]}
      >
        <AppIcon
          type="MaterialCommunityIcons"
          name="chevron-right"
          size={22}
          color={colors.text}
        />
      </TouchableOpacity>

      {/* Last Page */}
      <TouchableOpacity
        activeOpacity={0.75}
        disabled={isLastPage || loading}
        onPress={() => handlePageChange(totalPages)}
        style={[
          styles.navigationButton,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            opacity:
              isLastPage || loading
                ? 0.35
                : 1,
          },
        ]}
      >
        <AppIcon
          type="MaterialCommunityIcons"
          name="page-last"
          size={21}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  navigationButton: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 3,
    borderWidth: 1,
    borderRadius: 23,
  },

  pageButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageText: {
    fontWeight: '600',
    lineHeight: 20,
  },
});