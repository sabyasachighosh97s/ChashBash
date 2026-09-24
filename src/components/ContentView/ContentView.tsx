import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Headline, Paragraph } from '@components/ui';
import AppIcon from '@components/AppIcon/AppIcon';
import ViewModeToggle from '@components/ViewModeToggle/ViewModeToggle';
import useThemeMode from '@hook/useThemeMode';
import Logo from '../../assets/images/Logo.png';

type ViewMode = 'grid' | 'list' | 'toggle';

type ContentViewProps = {
  data: any[];

  /**
   * How this component should behave.
   *
   * grid   -> Grid only, no toggle
   * list   -> List only, no toggle
   * toggle -> User can switch Grid/List
   */
  viewMode?: ViewMode;

  /**
   * Initial mode when viewMode="toggle"
   */
  initialView?: 'grid' | 'list';

  /**
   * Kept for compatibility.
   */
  showToggle?: boolean;

  /**
   * Title field.
   *
   * Examples:
   * "title"
   * "crop_name.name"
   */
  titleKey?: string;

  /**
   * Description field.
   */
  descriptionKey?: string;

  /**
   * Image array field.
   *
   * Example:
   * "images"
   */
  imageKey?: string;

  /**
   * Fallback icon when image doesn't exist.
   */
  fallbackIcon?: string;

  /**
   * Fallback title.
   */
  fallbackTitle?: string;

  /**
   * Item press callback.
   */
  onPress?: (item: any) => void;

  /**
   * Called when Grid/List changes.
   */
  onViewModeChange?: (mode: 'grid' | 'list') => void;

  /**
   * Show description in List view.
   */
  showDescription?: boolean;

  /**
   * Show description in Grid view
   *
   * Default = false
   */
  showDescriptionInGrid?: boolean;

  /**
   * Empty state text.
   */
  emptyText?: string;

  /**
   * Empty state icon.
   */
  emptyIcon?: string;

  /**
   * Number of columns in Grid.
   *
   * Default = 2
   *
   * POP uses 3.
   */
  gridColumns?: 2 | 3;
};

const ContentView = ({
  data,

  viewMode = 'grid',

  initialView = 'grid',

  showToggle = true,

  titleKey = 'title',

  descriptionKey = 'description',

  imageKey = 'images',

  fallbackIcon = 'information-outline',

  fallbackTitle = 'Information',

  onPress,

  onViewModeChange,

  showDescription = true,
  showDescriptionInGrid = false,
  emptyText = 'No data found',

  emptyIcon,

  gridColumns = 2,
}: ContentViewProps) => {
  const { theme } = useThemeMode();

  // ==========================================
  // INTERNAL VIEW MODE
  // ==========================================

  const [internalViewMode, setInternalViewMode] = useState<'grid' | 'list'>(
    initialView,
  );

  // ==========================================
  // CURRENT VIEW MODE
  // ==========================================

  const currentViewMode: 'grid' | 'list' =
    viewMode === 'toggle' ? internalViewMode : viewMode;

  const isGridView = currentViewMode === 'grid';

  // ==========================================
  // VIEW MODE CHANGE
  // ==========================================

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setInternalViewMode(mode);

    onViewModeChange?.(mode);
  };

  // ==========================================
  // GET NESTED VALUE
  // ==========================================

  const getValue = (item: any, path: string) => {
    if (!item || !path) {
      return undefined;
    }

    return path.split('.').reduce((value, key) => {
      return value?.[key];
    }, item);
  };

  // ==========================================
  // REMOVE HTML
  // ==========================================

  const cleanText = (text: any) => {
    if (!text) {
      return '';
    }

    return String(text)
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/p>/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // ==========================================
  // DATA
  // ==========================================

  const listData = Array.isArray(data) ? data : [];

  // ==========================================
  // RENDER EXISTING TOGGLE COMPONENT
  // ==========================================

  const renderToggle = () => {
    /**
     * IMPORTANT:
     *
     * Only show ViewModeToggle when:
     *
     * viewMode="toggle"
     *
     * Therefore:
     *
     * POP:
     * viewMode="grid"
     * -> no toggle
     *
     * List-only screen:
     * viewMode="list"
     * -> no toggle
     *
     * Information/Training:
     * viewMode="toggle"
     * -> existing ViewModeToggle
     */

    if (viewMode !== 'toggle' || !showToggle) {
      return null;
    }

    return (
      <View style={styles.toggleWrapper}>
        <ViewModeToggle
          isGridView={internalViewMode === 'grid'}
          onToggle={() => {
            const nextMode = internalViewMode === 'grid' ? 'list' : 'grid';

            handleViewModeChange(nextMode);
          }}
        />
      </View>
    );
  };

  // ==========================================
  // RENDER ITEM
  // ==========================================

  const renderItem = ({ item }: { item: any }) => {
    const titleValue = getValue(item, titleKey);

    const title = cleanText(
      typeof titleValue === 'object' ? titleValue?.name : titleValue,
    );

    const description = cleanText(getValue(item, descriptionKey));

    const images = getValue(item, imageKey);

    let imageUrl: string | null = null;
    let localImage: any = null;

    /*
     * Guest Preview
     * -----------------------------
     * Guest static data uses:
     * item.image
     *
     * Registered/API data uses:
     * item.images
     */
    if (item?.isGuestPreview && item?.image) {
      localImage = item.image;
    } else if (Array.isArray(images) && images.length > 0) {
      imageUrl = images[0]?.file_path ?? null;
    } else if (typeof images === 'string' && images.trim()) {
      imageUrl = images.startsWith('http')
        ? images
        : `https://aireport.mygreenqube.com:9901${images}`;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress?.(item)}
        style={[
          styles.card,

          isGridView ? styles.gridCard : styles.listCard,

          isGridView && gridColumns === 3 && styles.gridCardThreeColumns,

          {
            backgroundColor: theme.colors.surface,

            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* ======================================
            IMAGE / FALLBACK ICON
        ====================================== */}

        <View
          style={[
            styles.imageContainer,

            isGridView ? styles.gridImageContainer : styles.listImageContainer,

            {
              backgroundColor: theme.colors.primary + '12',
            },
          ]}
        >
          {localImage ? (
            <Image
              source={localImage}
              style={[
                styles.image,
                isGridView ? styles.gridImage : styles.listImage,
              ]}
              resizeMode="cover"
            />
          ) : imageUrl ? (
            <Image
              source={{
                uri: imageUrl,
              }}
              style={[
                styles.image,
                isGridView ? styles.gridImage : styles.listImage,
              ]}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={Logo}
              style={[
                styles.logoFallback,
                isGridView ? styles.gridLogoFallback : styles.listLogoFallback,
              ]}
              resizeMode="contain"
            />
          )}
        </View>

        {/* ======================================
            TEXT CONTENT
        ====================================== */}

        <View
          style={[
            styles.textContainer,

            isGridView ? styles.gridTextContainer : styles.listTextContainer,
          ]}
        >
          <Headline
            size="sm"
            numberOfLines={isGridView ? 1 : 1}
            style={{
              textAlign: isGridView ? 'center' : 'left',

              color: theme.colors.text,

              lineHeight: 20,
            }}
          >
            {title || fallbackTitle}
          </Headline>

          {/* ==================================
              LIST DESCRIPTION
          ================================== */}

          {showDescription &&
          description &&
          (!isGridView || showDescriptionInGrid) ? (
            <Paragraph
              size="xs"
              numberOfLines={1}
              style={{
                marginTop: 1,
                textAlign: isGridView ? 'center' : 'left',
                color: theme.colors.subText,
                lineHeight: 18,
              }}
            >
              {description}
            </Paragraph>
          ) : null}
        </View>

        {/* ======================================
            LIST ARROW
        ====================================== */}

        {!isGridView && (
          <AppIcon
            type="MaterialCommunityIcons"
            name="chevron-right"
            size={22}
            color={theme.colors.subText}
          />
        )}
      </TouchableOpacity>
    );
  };

  // ==========================================
  // EMPTY
  // ==========================================

  if (listData.length === 0) {
    return (
      <View style={styles.wrapper}>
        {renderToggle()}

        <View style={styles.emptyContainer}>
          <AppIcon
            type="MaterialCommunityIcons"
            name={emptyIcon ?? fallbackIcon}
            size={45}
            color={theme.colors.subText}
          />

          <Paragraph
            size="sm"
            style={{
              marginTop: 10,

              color: theme.colors.subText,
            }}
          >
            {emptyText}
          </Paragraph>
        </View>
      </View>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <View style={styles.wrapper}>
      {renderToggle()}

      <FlatList
        data={listData}
        /**
         * Important:
         *
         * Grid/List layout changes
         * correctly when toggled.
         */
        key={currentViewMode === 'grid' ? `grid-${gridColumns}` : 'list'}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?.id?.toString() ?? item?.fid?.toString() ?? index.toString()
        }
        numColumns={isGridView ? gridColumns : 1}
        columnWrapperStyle={isGridView ? styles.gridRow : undefined}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ContentView;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  toggleWrapper: {
    alignItems: 'flex-end',
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  listContainer: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  gridRow: {
    justifyContent: 'flex-start',
    gap: 12,
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  gridCard: {
    width: '48%',
    minHeight: 155,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gridCardThreeColumns: {
    width: '31%',
    minHeight: 150,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },

  listCard: {
    width: '100%',
    minHeight: 82,
    paddingVertical: 11,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  gridImageContainer: {
    width: 78,
    height: 78,
    borderRadius: 20,
    padding: 3,
  },

  listImageContainer: {
    width: 58,
    height: 58,
    borderRadius: 16,
    padding: 3,
  },

  image: {
    width: '100%',

    height: '100%',
  },

  gridImage: {
    borderRadius: 17,
  },

  listImage: {
    borderRadius: 13,
  },

  textContainer: {
    flex: 1,
  },

  gridTextContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 9,
  },

  listTextContainer: {
    marginLeft: 14,
    marginRight: 8,
    justifyContent: 'center',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingHorizontal: 30,
  },
  logoFallback: {
    width: '70%',
    height: '70%',
  },

  gridLogoFallback: {
    width: '90%',
    height: '90%',
  },

  listLogoFallback: {
    width: '90%',
    height: '90%',
  },
});
