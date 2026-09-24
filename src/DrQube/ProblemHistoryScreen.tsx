import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { problemHistoryGet } from '../api/client';
import { API_ROUTES } from '../api/routes';
import { Container } from '@components/ui';
import CustomHeader from '@components/Header/CustomHeader';
import ContentView from '@components/ContentView/ContentView';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';

interface ProblemLabel {
  class_id: number;
  name_en: string;
  name_bn: string;
  primary_category_en: string;
  primary_category_bn: string;
}

interface PrimaryTreatment {
  id: number;
  crop_en: string;
  crop_bn: string;
  chemical: string;
  chemical_type: string;
  dosage: string;
  sms_en: string | null;
  sms_bn: string | null;
  sms_stage2_bn?: string | null;
}

interface ProblemRecommendation {
  id: number;
  class_id: number;

  crop: {
    en: string;
    bn: string;
  };

  problem_type: {
    en: string;
    bn: string;
  };

  chemical: string;
  chemical_type: string;
  dosage: string;

  sms_en: string | null;
  sms_bn: string | null;
  sms_stage2_bn?: string | null;
}

interface ProblemHistoryItem {
  id: number;
  user_id: string;
  user_ph: string;
  user_name?: string;
  panchayat_name?: string;
  panchayat_id?: string;
  district_name?: string;
  district_id?: string;
  block_id?: string;
  block_name?: string;
  image: string;
  confidence: number;
  created_at: string;
  label: ProblemLabel;
  primary_treatment: PrimaryTreatment | null;
  recommendations?: ProblemRecommendation[];
  comments?: any[];
}

interface Props {
  navigation: any;
  route?: any;
}
const ProblemHistoryScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    user,
    token,
    userType,
    profileCompleted,
    cropCompleted,
    completeProfile,
    loginWithOtp,
    logout,
  } = useAuth();

  const [problemHistory, setProblemHistory] = useState<ProblemHistoryItem[]>(
    [],
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [selectedCrop, setSelectedCrop] = useState<string>('');

  const getProblemHistory = useCallback(async () => {
    try {
      setLoading(true);

      const response = await problemHistoryGet(API_ROUTES.GET.PROBLEM_HISTORY, {
        params: {
          user_id: user.id,
          user_ph: user.phone,
          user_name: user.name,

          district_name: user.state,
          district_id: user.stateID,

          block_id: user.districtID,
          block_name: user.district,

          panchayat_name: user.block,
          panchayat_id: user.blockID,
        },
      });

      const historyData = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      setProblemHistory(historyData);
    } catch (error: any) {
      console.log(
        'Problem History API Error:',
        error?.response?.data || error?.message || error,
      );
      setProblemHistory([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.phone]);

  useEffect(() => {
    getProblemHistory();
  }, [getProblemHistory]);

  const availableCrops = useMemo(() => {
    const crops = problemHistory
      .map(item => {
        return item?.primary_treatment?.crop_en || '';
      })
      .filter(Boolean);

    return [...new Set(crops)];
  }, [problemHistory]);

  const filteredProblemHistory = useMemo(() => {
    if (!selectedCrop) {
      return problemHistory;
    }

    return problemHistory.filter(item => {
      const crop = item?.primary_treatment?.crop_en || '';

      return crop.toLowerCase() === selectedCrop.toLowerCase();
    });
  }, [problemHistory, selectedCrop]);

  const formatProblemDate = (date: string) => {
    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const displayProblemHistory = useMemo(() => {
    return filteredProblemHistory.map(item => {
      const displayLabel = item?.label?.name_bn || '';

      const chemical = item?.primary_treatment?.chemical || '';

      const dosage = item?.primary_treatment?.dosage || '';

      const displayTreatment = dosage ? `${chemical} - ${dosage}` : chemical;

      return {
        ...item,

        /*
         * UI-only fields
         */
        display_label: displayLabel,

        display_treatment: displayTreatment,

        display_date: formatProblemDate(item.created_at),

        display_image: item.image,
      };
    });
  }, [filteredProblemHistory]);

  const onPressProblem = (item: ProblemHistoryItem) => {
    /*
     * BUSINESS LOGIC IS UNCHANGED.
     *
     * Pass original API object.
     */
    navigation.navigate('HistoryResultScreen', {
      historyData: item,
    });
  };

  const handleCropSelect = (crop: string) => {
    setSelectedCrop(crop);

    setModalVisible(false);
  };

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        ) : (
          <ContentView
            data={displayProblemHistory}
            viewMode="grid"
            initialView="grid"
            /*
             * LABEL
             */
            titleKey="display_label"
            /*
             * TREATMENT
             */
            descriptionKey="display_date"
            /*
             * IMAGE
             */
            imageKey="display_image"
            gridColumns={3}
            fallbackIcon="sprout"
            fallbackTitle={t('problem')}
            showDescription={true}
            emptyText={t('no_problem_found')}
            emptyIcon="sprout-outline"
            showDescriptionInGrid={true}
            onPress={onPressProblem}
          />
        )}
      </View>
    </Container>
  );
};

export default ProblemHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
