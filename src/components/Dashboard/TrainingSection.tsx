import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Card, Headline, Paragraph } from '@components/ui';
import AppIcon from '@components/AppIcon/AppIcon';
import useThemeMode from '@hook/useThemeMode';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/images/Logo.png';
import { apiGet } from '../../api/client';
import { API_ROUTES } from '../../api/routes';
import GuestAccessModal, {
  getGuestPreviewData,
  useGuestAccess,
} from '@components/common/GuestAccess';

type Props = {
  onSeeAll: () => void;
  onTrainingPress?: (item: any) => void;
};

const TrainingSection = ({ onSeeAll, onTrainingPress }: Props) => {
  const { theme } = useThemeMode();
  const { t } = useTranslation();
  const {
    isGuest,
    visible,
    openGuestAccess,
    closeGuestAccess,
    goToRegistration,
  } = useGuestAccess();

  // ==========================================
  // AUTH TOKEN
  // ==========================================

  const { token } = useAuth();

  // ==========================================
  // STATE
  // ==========================================

  const [trainingList, setTrainingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOAD TRAINING
  // ==========================================

  useEffect(() => {
    if (token && !isGuest) {
      loadTraining();
    } else {
      setTrainingList([]);
    }
  }, [token, isGuest]);

  const loadTraining = async () => {
    try {
      setLoading(true);

      const response = await apiGet(API_ROUTES.GET.POSTS, token, {
        params: {
          type: 'training',
          page: 1,
          page_size: 10,
          order_by: 'created_at',
          order_dir: 'desc',
          lang_id: 1,
        },
      });

      const items = response.data?.items ?? [];

      // Dashboard shows maximum 3 trainings
      setTrainingList(items.slice(0, 3));
    } catch (error: any) {
      console.log(error?.response?.data);
      console.log(error?.message);

      setTrainingList([]);
    } finally {
      setLoading(false);
    }
  };

  const displayTrainingList = isGuest
    ? getGuestPreviewData('training')
    : trainingList;

  return (
    <>
      <Card
        variant="contained"
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        {/* ==========================================
          HEADER
      ========================================== */}

        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Headline
              size="sm"
              style={[
                styles.headerTitle,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              {t('agri_training')}
            </Headline>

            <Paragraph
              size="xs"
              numberOfLines={1}
              style={[
                styles.subtitle,
                {
                  color: theme.colors.subText,
                },
              ]}
            >
              {t('agri_training_desc')}
            </Paragraph>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSeeAll}
            style={styles.seeAllButton}
          >
         <Paragraph
  size="sm"
  numberOfLines={1}
  style={[
    styles.seeAllText,
    {
      color: theme.colors.primary,
    },
  ]}
>
  {t('see_all')}
</Paragraph>
            <AppIcon
              type="MaterialCommunityIcons"
              name="chevron-right"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* ==========================================
          DIVIDER
      ========================================== */}

        <View
          style={[
            styles.divider,
            {
              backgroundColor: theme.colors.border,
            },
          ]}
        />

        {/* ==========================================
          LOADING
      ========================================== */}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        ) : displayTrainingList.length === 0 ? (
          /* ==========================================
            EMPTY
        ========================================== */

          <View style={styles.emptyContainer}>
            <Paragraph
              size="xs"
              style={{
                color: theme.colors.subText,
              }}
            >
              {t('no_training_found')}
            </Paragraph>
          </View>
        ) : (
          /* ==========================================
            TRAINING LIST
        ========================================== */

          displayTrainingList.map(item => (
            <TouchableOpacity
              key={item?.id}
              activeOpacity={0.8}
              onPress={() => {
                if (isGuest) {
                  openGuestAccess();
                  return;
                }

                onTrainingPress?.(item);
              }}
              style={styles.item}
            >
              {/* ======================================
                ICON
            ====================================== */}

              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: theme.colors.primary + '15',
                  },
                ]}
              >
                {item?.isGuestPreview && item?.image ? (
                  <Image
                    source={item.image}
                    style={styles.itemLogo}
                    resizeMode="cover"
                  />
                ) : item?.images?.length > 0 && item?.images?.[0]?.file_path ? (
                  <Image
                    source={{
                      uri: item.images[0].file_path,
                    }}
                    style={styles.itemLogo}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={Logo}
                    style={styles.itemLogo}
                    resizeMode="contain"
                  />
                )}
              </View>

              {/* ======================================
                TITLE
            ====================================== */}

              <View style={styles.textContainer}>
                <Headline
                  size="sm"
                  numberOfLines={1}
                  style={[
                    styles.itemTitle,
                    {
                      color: theme.colors.text,
                    },
                  ]}
                >
                  {item?.title ?? t('training')}
                </Headline>
              </View>

              {/* ======================================
                RIGHT ARROW
            ====================================== */}

              <View style={styles.arrowContainer}>
                <AppIcon
                  type="MaterialCommunityIcons"
                  name="chevron-right"
                  size={20}
                  color={theme.colors.subText}
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </Card>
      <GuestAccessModal
        visible={visible}
        onClose={closeGuestAccess}
        onRegister={goToRegistration}
      />
    </>
  );
};

export default TrainingSection;

const styles = StyleSheet.create({
  // ==========================================
  // CARD
  // ==========================================

  card: {
    padding: 15,
    borderRadius: 18,
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  headerTitle: {
    textAlign: 'left',
    includeFontPadding: false,
    lineHeight: 22,
  },

  subtitle: {
    marginTop: -4,
    textAlign: 'left',
    includeFontPadding: false,
  },

  // ==========================================
  // SEE ALL
  // ==========================================

  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingLeft: 0,
  },

  seeAllText: {
    textAlign: 'right',
    includeFontPadding: false,
    lineHeight: 20,
    fontWeight: '700',
  },

  // ==========================================
  // DIVIDER
  // ==========================================

  divider: {
    height: 1,
    marginVertical: 14,
  },

  // ==========================================
  // TRAINING ITEM
  // ==========================================

  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    minHeight: 40,
  },

  // ==========================================
  // ICON
  // ==========================================

  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 6,
    flexShrink: 0,
  },

  // ==========================================
  // TITLE
  // ==========================================

  textContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 4,

    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  itemTitle: {
    width: '100%',
    textAlign: 'left',

    includeFontPadding: false,

    lineHeight: 22,

    flexShrink: 1,
  },

  // ==========================================
  // ARROW
  // ==========================================

  arrowContainer: {
    width: 20,
    height: 24,

    justifyContent: 'center',
    alignItems: 'center',

    flexShrink: 0,
  },

  // ==========================================
  // LOADING
  // ==========================================

  loadingContainer: {
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ==========================================
  // EMPTY
  // ==========================================

  emptyContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  itemLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});
