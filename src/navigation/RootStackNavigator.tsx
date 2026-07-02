import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';

import SplashScreen from '@screens/SplashScreen';
import LoginScreen from '@screens/LoginScreen';
import OtpVerificationScreen from '@screens/OtpVerificationScreen';
import RegistrationScreen from '@screens/RegistrationScreen';

import BottomTabNavigator from './BottomTabNavigator';

import DiseaseResultScreen from '../DrQube/DiseaseResultScreen';
import VisionCameraScreen from '../DrQube/VisionCameraScreen';
import WeatherDetailsScreen from '@screens/WeatherDetailsScreen';
import CommentsScreen from '../Community/CommentsScreen';

const Stack = createNativeStackNavigator();

export default function RootStackNavigator() {
  const { isLoading, isLoggedIn } = useAuth();

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
    );
  }

  /*
  =====================================
  Logged In Stack
  =====================================
  */

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

      <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />

      <Stack.Screen name="DiseaseResult" component={DiseaseResultScreen} />

      <Stack.Screen name="VisionCamera" component={VisionCameraScreen} />

      <Stack.Screen name="Comments" component={CommentsScreen} />

      <Stack.Screen name="WeatherDetails" component={WeatherDetailsScreen} />
    </Stack.Navigator>
  );
}
