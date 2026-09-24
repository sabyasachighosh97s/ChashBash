import React, { memo, useCallback, useMemo } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  StyleSheet,
  Platform,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import AppIcon from '@components/AppIcon/AppIcon';
import { CustomStatusBar } from '@components/common/CustomStatusBar';
import colors from '@themes/colors';

type Props = {
  showFilter?: boolean;
  onFilterPress?: () => void;
  onBackPress?: () => void;
};

const HEADER_TITLES: Record<string, string> = {
  Home: 'dashboard',

  Government: 'pop',

  GovernmentSchemeDetails: 'government_scheme',

  Community: 'community',

  Comments: 'comments',

  Profile: 'profile',

  Training: 'training',
  TrainingList: 'training',
  TrainingDetails: 'training_detail',

  Information: 'information',
  InformationList: 'information',
  InformationDetail: 'information_detail',

  POP: 'pop',
  POPDetail: 'pop_detail',

  InputOutput: 'input_output',

  WeatherDetails: 'weather',

  DiseaseResult: 'disease_result',

  VisionCamera: 'dr_qube',

  RegistrationScreen: 'registration',

  MyCropsScreen: 'my_crops',

  ProblemHistoryScreen: 'problem_history',

  HistoryResultScreen: 'history_result',
};

const HEADER_HEIGHT = Platform.OS === 'android' ? 70 : 60;

const CustomHeader = ({
  showFilter = false,
  onFilterPress,
  onBackPress,
}: Props) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  /*
  ======================================
  Dynamic Title
  ======================================
  */

  const title = useMemo(() => {
    const key = HEADER_TITLES[route.name];
    return key ? t(key) : route.name;
  }, [route.name, t]);

  /*
  ======================================
  Dashboard Check
  ======================================
  */

  const isDashboard = useMemo(() => {
    return route.name === 'Home';
  }, [route.name]);

  /*
  ======================================
  Back Button
  ======================================
  */

  const handleBack = useCallback(() => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (isDashboard) {
      Alert.alert('Exit ChashBash', 'Do you want to close the application?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
        },
      ]);

      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'MainTabs',
        }),
      );
    }
  }, [navigation, isDashboard, onBackPress]);

  /*
  ======================================
  Filter
  ======================================
  */

  const handleFilter = useCallback(() => {
    onFilterPress?.();
  }, [onFilterPress]);

  /*
  ======================================
  TOP SAFE INSET
  ======================================

  The SafeAreaView was removed, so the header now
  handles the top inset explicitly only where the
  system can draw content behind the status bar.
  */

  const manualTopInset =
    Platform.OS === 'ios' ||
    (Platform.OS === 'android' && Number(Platform.Version) >= 35)
      ? insets.top
      : 0;

  return (
    <>
      {/* Status bar and header use the exact same color. */}
      <CustomStatusBar
        backgroundColor={colors.primary}
        barStyle="light-content"
        translucent={false}
      />

      {/* Header surface replaces SafeAreaView without changing business logic. */}
      <View
        style={[
          styles.headerSurface,
          {
            paddingTop: manualTopInset,
          },
        ]}
      >
        <View style={styles.container}>
          {/* Left Section */}

          <View style={styles.leftContainer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleBack}
              style={styles.backButton}
            >
              <AppIcon
                type="MaterialCommunityIcons"
                name="arrow-left"
                size={22}
                color={colors.textLight}
              />
            </TouchableOpacity>

            <Image
              source={require('@assets/images/Logo.png')}
              resizeMode="contain"
              style={styles.logo}
            />

            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
            </View>
          </View>

          {/* Right Section */}

          <View style={styles.rightContainer}>
            {showFilter && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleFilter}
                style={styles.filterButton}
              >
                <AppIcon
                  type="MaterialCommunityIcons"
                  name="tune-variant"
                  size={22}
                  color={colors.textLight}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default memo(CustomHeader);

const styles = StyleSheet.create({
  headerSurface: {
    backgroundColor: colors.primary,
  },

  container: {
    minHeight: HEADER_HEIGHT,

    backgroundColor: colors.primary,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 20,

    // elevation: 12,

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 12,
  },

  leftContainer: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 46,
    height: 46,

    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.15)',
    borderBottomLeftRadius: 24,

    borderBottomRightRadius: 24,
  },

  logo: {
    width: 34,
    height: 34,

    marginLeft: 10,
  },

  titleContainer: {
    flex: 1,

    marginLeft: 12,
  },

  title: {
    color: colors.textLight,

    fontSize: 20,

    fontWeight: '800',

    letterSpacing: 0.4,
  },

  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
