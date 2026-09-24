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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../api/client';
import { API_ROUTES } from '../../api/routes';
import GuestAccessModal, {
  getGuestPreviewData,
  useGuestAccess,
} from '@components/common/GuestAccess';
import Pagination from '@components/common/Pagination/Pagination';

const PAGE_SIZE = 10;

const TrainingListScreen = () => {
  const {
    isGuest,
    visible,
    openGuestAccess,
    closeGuestAccess,
    goToRegistration,
  } = useGuestAccess();

  const navigation = useNavigation<any>();
  const { theme } = useThemeMode();
  const { t } = useTranslation();
  const { token, userType } = useAuth();

  const [search, setSearch] = useState('');
  const [trainingList, setTrainingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (token && !isGuest) {
      loadTraining(currentPage);
    }
  }, [token, isGuest, currentPage]);

  const loadTraining = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError('');

      const response = await apiGet(API_ROUTES.GET.POSTS, token, {
        params: {
          type: 'training',
          page,
          page_size: PAGE_SIZE,
          order_by: 'created_at',
          order_dir: 'desc',
          lang_id: 1,
        },
      });

      console.log('Training List Response:', response.data);

      const items = response.data?.items ?? [];

      setTrainingList(items);

      // API returns total number of records.
      // Example: total = 36, page_size = 10 => 4 pages.
      const total = Number(response.data?.total ?? 0);

      setTotalPages(
        total > 0 ? Math.ceil(total / PAGE_SIZE) : 1,
      );
    } catch (error: any) {
      console.log(error?.response?.data);
      console.log(error?.message);

      setTrainingList([]);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          t('training_load_failed'),
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainingList = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return trainingList;
    }

    return trainingList.filter(item =>
      String(item?.title ?? '')
        .toLowerCase()
        .includes(searchText),
    );
  }, [trainingList, search]);

  const formattedTrainingList = useMemo(() => {
    return filteredTrainingList.map(item => ({
      ...item,
      formattedDate: item?.created_at
        ? new Date(item.created_at).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '',
    }));
  }, [filteredTrainingList]);

  const displayTrainingList = isGuest
    ? getGuestPreviewData('training')
    : formattedTrainingList;

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
            {t('training_loading')}
          </Paragraph>
        </View>
      </Container>
    );
  }

  if (error && trainingList.length === 0) {
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
            {t('training_load_failed')}
          </Headline>

          <Paragraph
            size="xs"
            style={{
              marginTop: 6,
              lineHeight: 19,
              color: theme.colors.subText,
              textAlign: 'center',
            }}
          >
            {error}
          </Paragraph>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => loadTraining(currentPage)}
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
          data={displayTrainingList}
          viewMode="toggle"
          initialView="grid"
          titleKey="title"
          descriptionKey="formattedDate"
          imageKey="images"
          fallbackIcon="book-education-outline"
          showDescription={true}
          emptyText={t('no_training_found')}
          emptyIcon="book-off-outline"
          onPress={item => {
            if (isGuest) {
              openGuestAccess();
              return;
            }

            navigation.navigate('TrainingDetails', {
              training: item,
            });
          }}
        />

        {!isGuest && trainingList.length > 0 && (
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

export default TrainingListScreen;

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
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});