import React from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppUpdate } from '../context/AppUpdateContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

import AppIcon from '@components/AppIcon/AppIcon';
import { Headline, Paragraph } from '@components/ui';
import colors from '@themes/colors';
import SplashScreen from '@screens/SplashScreen';
import LoginScreen from '@screens/LoginScreen';
import OtpVerificationScreen from '@screens/OtpVerificationScreen';
import RegistrationScreen from '@screens/RegistrationScreen';

import BottomTabNavigator from './BottomTabNavigator';

import DiseaseResultScreen from '../DrQube/DiseaseResultScreen';
import VisionCameraScreen from '../DrQube/VisionCameraScreen';
import WeatherDetailsScreen from '@screens/WeatherDetailsScreen';
import CommentsScreen from '../screens/Community/CommentsScreen';
import GovernmentSchemeDetailsScreen from '@screens/GovtScheme/GovernmentSchemeDetailsScreen';
import TrainingScreen from '@screens/Training/TrainingListScreen';
import InputOutputScreen from '@screens/InputOutput/InputOutputScreen';
import InputRequestScreen from
  '@screens/InputOutput/InputRequestScreen';
  import MyInputRequestsScreen from
  '@screens/InputOutput/MyInputRequestsScreen';
import CreatePostScreen from '@screens/Community/CreatePostScreen';
import TrainingListScreen from '@screens/Training/TrainingListScreen';
import TrainingDetailScreen from '@screens/Training/TrainingDetailScreen';
import InformationDetailScreen from '@screens/Information/InformationDetailScreen';
import InformationListScreen from '@screens/Information/InformationListScreen';
import POPListScreen from '@screens/POP/POPListScreen';
import POPDetailScreen from '@screens/POP/POPDetailScreen';
import MyCropsScreen from '@screens/Profile/MyCropsScreen';
import ProblemHistoryScreen from '../DrQube/ProblemHistoryScreen';
import HistoryResultScreen from '../DrQube/HistoryResultScreen';

const Stack = createNativeStackNavigator();

const ForceUpdateModal = ({
  visible,
  latestVersion,
  storeUrl,
}: {
  visible: boolean;
  latestVersion: string;
  storeUrl: string;
}) => {
  const { t } = useTranslation();

  const handleUpdate = async () => {
    if (!storeUrl) {
      return;
    }

    try {
      await Linking.openURL(storeUrl);
    } catch (error) {
      console.log('Open Store Error =>', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.updateContainer}>
          <View style={styles.iconContainer}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="update"
              size={34}
              color={colors.primary}
            />
          </View>

          <Headline style={styles.updateTitle}>
            {t('app_update_required_title')}
          </Headline>

          <Paragraph
            style={styles.updateMessage}
          >
            {t('app_update_required_message')}
          </Paragraph>

          {latestVersion ? (
            <Paragraph
              style={styles.versionText}
            >
              {t('app_latest_version', {
                version: latestVersion,
              })}
            </Paragraph>
          ) : null}

          <Pressable
            style={styles.updateButton}
            onPress={handleUpdate}
          >
            <AppIcon
              type="MaterialCommunityIcons"
              name="download"
              size={20}
              color={colors.textLight}
              style={styles.buttonIcon}
            />

            <Paragraph style={styles.updateButtonText}>
              {t('app_update_now')}
            </Paragraph>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const AppUpdateGate = ({
  children,
  isCheckingUpdate,
  updateRequired,
  latestVersion,
  storeUrl,
}: {
  children: React.ReactNode;
  isCheckingUpdate: boolean;
  updateRequired: boolean;
  latestVersion: string;
  storeUrl: string;
}) => {
  /*
   * Wait for the version check to finish.
   *
   * We don't show the update modal while the
   * Play Store check is still running.
   */
  if (isCheckingUpdate) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      <ForceUpdateModal
        visible={updateRequired}
        latestVersion={latestVersion}
        storeUrl={storeUrl}
      />
    </>
  );
};

export default function RootStackNavigator() {
  const { isLoading, isLoggedIn } = useAuth();

const {
  isCheckingUpdate,
  updateRequired,
  latestVersion,
  storeUrl,
} = useAppUpdate();
  console.log('isLoggedIn =', isLoggedIn);
  /*
  =====================================
  Wait until Session Restore finishes
  =====================================
  */

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /*
  =====================================
  Guest / Logged Out Stack
  =====================================
  */
if (!isLoggedIn) {
  return (
    <AppUpdateGate
      isCheckingUpdate={isCheckingUpdate}
      updateRequired={updateRequired}
      latestVersion={latestVersion}
      storeUrl={storeUrl}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />

        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
        />

        <Stack.Screen
          name="RegistrationScreen"
          component={RegistrationScreen}
        />
      </Stack.Navigator>
    </AppUpdateGate>
  );
}

  /*
  =====================================
  Logged In Stack
  =====================================
  */

 return (
  <AppUpdateGate
    isCheckingUpdate={isCheckingUpdate}
    updateRequired={updateRequired}
    latestVersion={latestVersion}
    storeUrl={storeUrl}
  >
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="InformationDetail"
        component={InformationDetailScreen}
      />

      <Stack.Screen name="InformationList" component={InformationListScreen} />

      <Stack.Screen name="TrainingList" component={TrainingListScreen} />

      <Stack.Screen name="TrainingDetails" component={TrainingDetailScreen} />

      <Stack.Screen name="POP" component={POPListScreen} />

      <Stack.Screen name="POPDetail" component={POPDetailScreen} />
      <Stack.Screen name="InputOutput" component={InputOutputScreen} />
      <Stack.Screen
  name="InputRequest"
  component={
    InputRequestScreen
  }
/>
<Stack.Screen
  name="MyInputRequests"
  component={MyInputRequestsScreen}
/>
      <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />

      <Stack.Screen name="DiseaseResult" component={DiseaseResultScreen} />

      <Stack.Screen name="VisionCamera" component={VisionCameraScreen} />

      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />

      <Stack.Screen name="WeatherDetails" component={WeatherDetailsScreen} />
      <Stack.Screen
        name="GovernmentSchemeDetails"
        component={GovernmentSchemeDetailsScreen}
      />

      <Stack.Screen name="MyCropsScreen" component={MyCropsScreen} />

      <Stack.Screen
        name="ProblemHistoryScreen"
        component={ProblemHistoryScreen}
      />

      <Stack.Screen
        name="HistoryResultScreen"
        component={HistoryResultScreen}
      />
    </Stack.Navigator>
    </AppUpdateGate>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backdrop,
    paddingHorizontal: 24,
  },

  updateContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
  },

  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.border,
    marginBottom: 18,
  },

  updateTitle: {
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },

  updateMessage: {
    color: colors.subText,
    textAlign: 'center',
    marginBottom: 12,
  },

  versionText: {
    color: colors.subText,
    textAlign: 'center',
    marginBottom: 22,
  },

  updateButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  buttonIcon: {
    marginRight: 8,
  },

  updateButtonText: {
    color: colors.textLight,
    fontWeight: '600',
    textAlign: 'center',
  },
});