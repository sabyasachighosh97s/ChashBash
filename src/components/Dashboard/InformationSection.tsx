import React, { useEffect, useState, useRef } from 'react';
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
import colors from '@themes/colors';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import GuestAccessModal, {
  getGuestPreviewData,
  useGuestAccess,
} from '@components/common/GuestAccess';
import { apiGet } from '../../api/client';
import { API_ROUTES } from '../../api/routes';
import Logo from '../../assets/images/Logo.png';

type Props = {
  onSeeAll: () => void;
  onInformationPress?: (item: any) => void;
};

const InformationSection = ({ onSeeAll, onInformationPress }: Props) => {
  const { theme } = useThemeMode();
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const {
    isGuest,
    visible,
    openGuestAccess,
    closeGuestAccess,
    goToRegistration,
  } = useGuestAccess();
  const [informationList, setInformationList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  const stateId = user?.stateID ?? '';
  const districtId = user?.districtID ?? '';
  const subdivisionId = user?.blockID ?? '';

  useEffect(() => {
    console.log("token",  token )
    if (token && !isGuest) {
      loadInformation();
    } else {
      setInformationList([]);
    }
  }, [token, isGuest, stateId, districtId, subdivisionId]);

  const loadInformation = async () => {
    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);

      const baseParams: any = {
        type: 'information',
        page: 1,
        page_size: 3,
        order_by: 'created_at',
        order_dir: 'desc',
        lang_id: 1,
      };

      const hasLocation = !!stateId || !!districtId || !!subdivisionId;

      /*
       * ----------------------------------------------------
       * CASE 1: User has NO location
       * ----------------------------------------------------
       *
       * Guest is already handled outside because token is
       * required. Registered user without location gets
       * all Information.
       */

      if (!hasLocation) {
        const response = await apiGet(API_ROUTES.GET.POSTS, token, {
          params: baseParams,
        });

        const items = response.data?.items ?? [];

        if (requestId !== requestIdRef.current) {
          return;
        }

        setInformationList(items.slice(0, 3));
        return;
      }

      /*
       * ----------------------------------------------------
       * CASE 2: User has location
       * ----------------------------------------------------
       *
       * First try to get Information for the user's
       * particular location.
       */

      const locationParams = {
        ...baseParams,
        ...(stateId ? { state_id: stateId } : {}),
        ...(districtId ? { district_id: districtId } : {}),
        ...(subdivisionId ? { subdivision_id: subdivisionId } : {}),
      };

      const locationResponse = await apiGet(API_ROUTES.GET.POSTS, token, {
        params: locationParams,
      });

      const locationItems = locationResponse.data?.items ?? [];

      /*
       * ----------------------------------------------------
       * CASE 2A:
       * Location has Information
       * ----------------------------------------------------
       */

      if (locationItems.length > 0) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setInformationList(locationItems.slice(0, 3));
        return;
      }

      /*
       * ----------------------------------------------------
       * CASE 2B:
       * Location has NO Information
       * ----------------------------------------------------
       *
       * Fallback to all Information.
       */

      const fallbackResponse = await apiGet(API_ROUTES.GET.POSTS, token, {
        params: baseParams,
      });

      const fallbackItems = fallbackResponse.data?.items ?? [];

      if (requestId !== requestIdRef.current) {
        return;
      }

      setInformationList(fallbackItems.slice(0, 3));
    } catch (error: any) {
      console.log(error?.response?.data);
      console.log(error?.message);

      if (requestId === requestIdRef.current) {
        setInformationList([]);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const displayInformationList = isGuest
    ? getGuestPreviewData('information')
    : informationList;

  return (
    <>
      <Card
        variant="contained"
        style={[
          styles.card,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Headline
              size="sm"
              style={{
                textAlign: 'left',
                color: theme.colors.text,

                includeFontPadding: false,
                lineHeight: 22,
              }}
            >
              {t('information_section_title')}
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
              {t('information_section_desc')}
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
              style={{
                color: theme.colors.primary,
                fontWeight: '700',
              }}
            >
              {t('see_all')}
            </Paragraph>

            <AppIcon
              type="MaterialCommunityIcons"
              name="chevron-right"
              size={19}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.divider,
            {
              backgroundColor: theme.colors.border,
            },
          ]}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        ) : displayInformationList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="information-off-outline"
              size={35}
              color={theme.colors.subText}
            />

            <Paragraph
              size="xs"
              style={{
                marginTop: 8,
                color: theme.colors.subText,
              }}
            >
              {t('no_information_found')}
            </Paragraph>
          </View>
        ) : (
          displayInformationList.map(item => (
            <TouchableOpacity
              key={item?.id}
              activeOpacity={0.8}
              style={styles.item}
              onPress={() => {
                if (isGuest) {
                  openGuestAccess();
                  return;
                }

                onInformationPress?.(item);
              }}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: theme.colors.warning + '15',
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

              <View style={styles.textContainer}>
                <Headline
                  size="sm"
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    color: theme.colors.text,
                  }}
                >
                  {item?.title ?? ''}
                </Headline>
              </View>

              <AppIcon
                type="MaterialCommunityIcons"
                name="chevron-right"
                size={20}
                color={theme.colors.subText}
              />
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

export default InformationSection;

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 18,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  subtitle: {
    marginTop: -4,
    textAlign: 'left',
    includeFontPadding: false,
  },

  divider: {
    height: 1,
    marginVertical: 14,
  },

  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    minHeight: 40,
  },

  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 6,
  },

  textContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 4,
  },

  loadingContainer: {
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },

  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingLeft: 2,
  },
 itemLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});
