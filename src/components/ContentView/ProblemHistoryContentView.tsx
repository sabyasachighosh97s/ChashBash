import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

import { Headline, Paragraph } from '@components/ui';
import AppIcon from '@components/AppIcon/AppIcon';
import useThemeMode from '@hook/useThemeMode';

const API_BASE_URL = 'http://188.166.254.225:9900';

type ProblemHistoryContentViewProps = {
  data: any[];

  /**
   * Number of columns
   *
   * Default = 3
   */
  gridColumns?: 2 | 3;

  /**
   * Called when user presses a card
   */
  onPress?: (item: any) => void;

  /**
   * Empty state text
   */
  emptyText?: string;

  /**
   * Empty state icon
   */
  emptyIcon?: string;

  /**
   * Fallback icon
   */
  fallbackIcon?: string;

  /**
   * Fallback title
   */
  fallbackTitle?: string;
};

const ProblemHistoryContentView = ({
  data,
  gridColumns = 3,
  onPress,
  emptyText = 'No problem history found',
  emptyIcon = 'sprout-outline',
  fallbackIcon = 'sprout',
  fallbackTitle = 'Problem',
}: ProblemHistoryContentViewProps) => {
  const { theme } = useThemeMode();

  const listData = Array.isArray(data) ? data : [];

  /**
   * ==========================================
   * GET IMAGE URL
   * ==========================================
   *
   * API:
   *
   * /uploads/20260813065042_0a23e878.jpeg
   *
   * Final:
   *
   * http://188.166.254.225:9900/uploads/...
   */
  const getImageUrl = (image: any) => {
    if (!image) {
      return null;
    }

    /**
     * If API already returns complete URL
     */
    if (typeof image === 'string' && image.startsWith('http')) {
      return image;
    }

    /**
     * Normal API response
     */
    if (typeof image === 'string') {
      return `${API_BASE_URL}${image}`;
    }

    return null;
  };

  /**
   * ==========================================
   * RENDER CARD
   * ==========================================
   */
  const renderItem = ({ item }: { item: any }) => {
    const imageUrl = getImageUrl(item?.image);

    const crop = item?.crop || '';

    const label = item?.label || '';

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress?.(item)}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* ==================================
            IMAGE
        ================================== */}

        <View
          style={[
            styles.imageContainer,
            {
              backgroundColor: theme.colors.primary + '12',
            },
          ]}
        >
          {imageUrl ? (
            <Image
              source={{
                uri: imageUrl,
              }}
              style={styles.image}
              resizeMode="cover"
              onError={error => {
                console.log('Problem History Image Error:', error.nativeEvent);
              }}
            />
          ) : (
            <AppIcon
              type="MaterialCommunityIcons"
              name={fallbackIcon}
              size={40}
              color={theme.colors.primary}
            />
          )}
        </View>

        {/* ==================================
            TEXT
        ================================== */}

        <View style={styles.textContainer}>
          {/* Disease / Problem */}
          <Headline
            size="sm"
            numberOfLines={2}
            style={{
              textAlign: 'center',
              color: theme.colors.text,
              lineHeight: 20,
              fontWeight: '700',
            }}
          >
            {label || fallbackTitle}
          </Headline>

          {/* Crop */}
          {crop ? (
            <Paragraph
              size="xs"
              numberOfLines={1}
              style={{
                marginTop: 3,
                textAlign: 'center',
                color: theme.colors.subText,
                lineHeight: 18,
              }}
            >
              {crop}
            </Paragraph>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * ==========================================
   * EMPTY STATE
   * ==========================================
   */
  if (listData.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.emptyContainer}>
          <AppIcon
            type="MaterialCommunityIcons"
            name={emptyIcon}
            size={45}
            color={theme.colors.subText}
          />

          <Paragraph
            size="sm"
            style={{
              marginTop: 10,
              color: theme.colors.subText,
              textAlign: 'center',
            }}
          >
            {emptyText}
          </Paragraph>
        </View>
      </View>
    );
  }

  /**
   * ==========================================
   * MAIN
   * ==========================================
   */
  return (
    <View style={styles.wrapper}>
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
        numColumns={gridColumns}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProblemHistoryContentView;

/* ==========================================
   STYLES
========================================== */

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  listContainer: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  /**
   * ==========================================
   * CARD
   * ==========================================
   */

  card: {
    width: '31.5%',

    minHeight: 175,

    borderWidth: 1,

    borderRadius: 20,

    marginBottom: 14,

    overflow: 'hidden',

    elevation: 2,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.06,

    shadowRadius: 4,

    paddingVertical: 12,

    paddingHorizontal: 7,

    alignItems: 'center',

    justifyContent: 'center',
  },

  /**
   * ==========================================
   * IMAGE
   * ==========================================
   */

  imageContainer: {
    width: 82,

    height: 82,

    borderRadius: 20,

    overflow: 'hidden',

    justifyContent: 'center',

    alignItems: 'center',
  },

  image: {
    width: '100%',

    height: '100%',

    borderRadius: 17,
  },

  /**
   * ==========================================
   * TEXT
   * ==========================================
   */

  textContainer: {
    width: '100%',

    alignItems: 'center',

    marginTop: 10,
  },

  /**
   * ==========================================
   * EMPTY
   * ==========================================
   */

  emptyContainer: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    paddingTop: 70,

    paddingHorizontal: 30,
  },
});
