import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container, Headline, Paragraph } from '@components/ui';
import AppIcon from '@components/AppIcon/AppIcon';
import CustomHeader from '@components/Header/CustomHeader';
import ContentView from '@components/ContentView/ContentView';
import useThemeMode from '@hook/useThemeMode';
import { apiGet } from '../../api/client';
import { API_ROUTES } from '../../api/routes';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import GuestAccessModal, {
  getGuestPreviewData,
  useGuestAccess,
} from '@components/common/GuestAccess';
import Pagination from '@components/common/Pagination/Pagination';

const PAGE_SIZE = 10;

const InformationListScreen = () => {
  const navigation = useNavigation<any>();
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

  const [search, setSearch] = useState('');
  const [informationList, setInformationList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const stateId = user?.stateID ?? '';
  const districtId = user?.districtID ?? '';
  const subdivisionId = user?.blockID ?? '';

  useEffect(() => {
    if (token && !isGuest) {
      loadInformation(currentPage);
    } else {
      setInformationList([]);
    }
  }, [token, isGuest, stateId, districtId, subdivisionId, currentPage]);

  const loadInformation = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError('');

      const baseParams: any = {
        type: 'information',
        page,
        page_size: PAGE_SIZE,
        order_by: 'created_at',
        order_dir: 'desc',
        lang_id: 1,
      };

      const hasLocation = !!stateId || !!districtId || !!subdivisionId;

      /*
       * ==========================================
       * CASE 1: NO LOCATION
       * ==========================================
       *
       * Registered user without location
       * should see all Information.
       */

      if (!hasLocation) {
        const response = await apiGet(API_ROUTES.GET.POSTS, token, {
          params: baseParams,
        });

        const items = response.data?.items ?? [];

        setInformationList(items);

        const total = Number(response.data?.total ?? 0);

        setTotalPages(
          total > 0 ? Math.ceil(total / PAGE_SIZE) : 1,
        );

        return;
      }

      /*
       * ==========================================
       * CASE 2: LOCATION EXISTS
       * ==========================================
       *
       * First try location-specific Information.
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
       * ==========================================
       * CASE 2A:
       * LOCATION DATA EXISTS
       * ==========================================
       */

      if (locationItems.length > 0) {
        console.log(
          'Location Information found -> showing location-specific data',
        );

        setInformationList(locationItems);

        const total = Number(locationResponse.data?.total ?? 0);

        setTotalPages(
          total > 0 ? Math.ceil(total / PAGE_SIZE) : 1,
        );

        return;
      }

      /*
       * ==========================================
       * CASE 2B:
       * LOCATION DATA DOES NOT EXIST
       * ==========================================
       *
       * Fallback to all Information.
       */

      const fallbackResponse = await apiGet(API_ROUTES.GET.POSTS, token, {
        params: baseParams,
      });

      const fallbackItems = fallbackResponse.data?.items ?? [];

      setInformationList(fallbackItems);

      const total = Number(fallbackResponse.data?.total ?? 0);

      setTotalPages(
        total > 0 ? Math.ceil(total / PAGE_SIZE) : 1,
      );
    } catch (error: any) {
      console.log(error?.response?.data);
      console.log(error?.message);

      setInformationList([]);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          t('information_load_failed'),
      );
    } finally {
      setLoading(false);
    }
  };

  const cleanText = (text: string) => {
    if (!text) {
      return '';
    }

    return text
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

  const filteredInformation = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return informationList;
    }

    return informationList.filter(item => {
      const title = cleanText(item?.title ?? '');

      return title.toLowerCase().includes(searchText);
    });
  }, [informationList, search]);

  const formattedInfoList = useMemo(() => {
    return filteredInformation.map(item => ({
      ...item,
      formattedDate: item?.created_at
        ? new Date(item.created_at).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '',
    }));
  }, [filteredInformation]);

  const displayInformationList = isGuest
    ? getGuestPreviewData('information')
    : formattedInfoList;

  // Pagination handler
  const handlePageChange = (page: number) => {
    if (page === currentPage || loading) {
      return;
    }

    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Container>
        <CustomHeader />

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
          />

          <Paragraph
            size="sm"
            style={{
              marginTop: 12,
              lineHeight: 20,
              color: theme.colors.subText,
            }}
          >
            {t('information_loading')}
          </Paragraph>
        </View>
      </Container>
    );
  }

  if (error && informationList.length === 0) {
    return (
      <Container>
        <CustomHeader />

        <View style={styles.emptyContainer}>
          <AppIcon
            type="MaterialCommunityIcons"
            name="alert-circle-outline"
            size={55}
            color={theme.colors.error}
          />

          <Headline
            size="sm"
            style={{
              marginTop: 12,
              color: theme.colors.text,
              textAlign: 'center',
            }}
          >
            {error}
          </Headline>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (!isGuest) {
                loadInformation(currentPage);
              }
            }}
            style={[
              styles.retryButton,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}
          >
            <Paragraph
              size="sm"
              style={{
                color: '#fff',
                fontWeight: '700',
                lineHeight: 20,
              }}
            >
              {t('try_again')}
            </Paragraph>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <CustomHeader />

      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <ContentView
          data={displayInformationList}
          viewMode="toggle"
          initialView="grid"
          titleKey="title"
          descriptionKey="formattedDate"
          imageKey="images"
          fallbackIcon="information-outline"
          fallbackTitle={t('information')}
          showDescription={true}
          emptyText={t('no_information_found')}
          emptyIcon="information-off-outline"
          onPress={item => {
            if (isGuest) {
              openGuestAccess();
              return;
            }

            navigation.navigate('InformationDetail', {
              information: item,
            });
          }}
        />

        {!isGuest && informationList.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </View>

      <GuestAccessModal
        visible={visible}
        onClose={closeGuestAccess}
        onRegister={goToRegistration}
      />
    </Container>
  );
};

export default InformationListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 30,
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});