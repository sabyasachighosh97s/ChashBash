import React, { useEffect, useMemo, useState } from 'react';

import { View, StyleSheet, ActivityIndicator } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Container } from '@components/ui';

import CustomHeader from '@components/Header/CustomHeader';

import ContentView from '@components/ContentView/ContentView';

import useThemeMode from '@hook/useThemeMode';

import CropFilterModal from './CropFilterModal';

import { useAuth } from '../../context/AuthContext';

import { apiGet } from '../../api/client';

import { API_ROUTES } from '../../api/routes';

import { useTranslation } from 'react-i18next';

import GuestAccessModal, {
  getGuestPreviewData,
  useGuestAccess,
} from '@components/common/GuestAccess';

import Pagination from '@components/common/Pagination/Pagination';

const PAGE_SIZE = 12;

const POPListScreen = () => {
  const navigation = useNavigation<any>();

  const { theme } = useThemeMode();

  const { token } = useAuth();

  const {
    isGuest,
    visible,
    openGuestAccess,
    closeGuestAccess,
    goToRegistration,
  } = useGuestAccess();

  const { t } = useTranslation();

  // ==========================================
  // STATE
  // ==========================================

  // "all" is the internal/default filter value.
  // UI label comes from i18n.
  const [popList, setPopList] = useState<any[]>([]);

  const [selectedCrop, setSelectedCrop] = useState('all');

  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ==========================================
  // LOAD POP API
  // ==========================================

  useEffect(() => {
    if (token && !isGuest) {
      loadPOP(currentPage);
    } else {
      setPopList([]);
    }
  }, [token, isGuest, currentPage]);

  const loadPOP = async (page: number = currentPage) => {
    try {
      setLoading(true);

      const response = await apiGet(API_ROUTES.GET.POSTS, token, {
        params: {
          type: 'package_practice',
          page,
          page_size: PAGE_SIZE,
          order_by: 'created_at',
          order_dir: 'desc',
          lang_id: 1,
        },
      });


      const items = response.data?.items ?? [];

      items.forEach((item: any, index: number) => {});

      setPopList(items);

      // API returns total number of POP records.
     const total = Number(response.data?.total ?? 0);

const calculatedTotalPages =
  total > 0 ? Math.ceil(total / PAGE_SIZE) : 1;



setTotalPages(calculatedTotalPages);
    } catch (error: any) {
      console.log(error?.response?.data);
      console.log(error?.message);

      setPopList([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGINATION
  // ==========================================

  const handlePageChange = (page: number) => {
    if (page === currentPage || loading) {
      return;
    }

    setCurrentPage(page);
  };

  // ==========================================
  // AVAILABLE CROP FILTER OPTIONS
  // ==========================================

  const availableCrops = useMemo(() => {
    const cropNames = popList
      .map(item => item?.crop_name?.name)
      .filter(Boolean);

    return [
      {
        value: 'all',
        label: t('all_crops'),
      },
      ...Array.from(new Set(cropNames)).map(crop => ({
        value: crop,
        label: crop,
      })),
    ];
  }, [popList, t]);

  // ==========================================
  // FILTER POP BY CROP
  // ==========================================

  const cropList = useMemo(() => {
    if (selectedCrop === 'all') {
      return popList;
    }

    return popList.filter(
      item => item?.crop_name?.name === selectedCrop,
    );
  }, [popList, selectedCrop]);

  const displayPOPList = isGuest
    ? getGuestPreviewData('pop')
    : cropList;

  // ==========================================
  // OPEN POP DETAIL
  // ==========================================

  const onPressCrop = (item: any) => {
    if (isGuest) {
      openGuestAccess();
      return;
    }

    navigation.navigate('POPDetail', {
      pop: item,
    });
  };

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <Container>
      {/* ==================================
          HEADER
      ================================== */}

      <CustomHeader
        showFilter={!isGuest}
        onFilterPress={() => setModalVisible(true)}
      />

      {/* ==================================
          CROP FILTER
      ================================== */}

      {!isGuest && (
        <CropFilterModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedCrop={selectedCrop}
          onSelect={setSelectedCrop}
          cropList={availableCrops}
        />
      )}

      {/* ==================================
          CONTENT
      ================================== */}

      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
            />
          </View>
        ) : (
          <>
            <ContentView
              data={displayPOPList}
              viewMode="grid"
              gridColumns={3}
              titleKey="crop_name.name"
              imageKey="images"
              fallbackIcon="sprout"
              fallbackTitle="POP"
              showDescription={false}
              emptyText={t('no_pop_found')}
              emptyIcon="sprout-outline"
              onPress={onPressCrop}
            />

            {!isGuest && popList.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </>
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

export default POPListScreen;

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
    paddingBottom: 75,
  },

    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});