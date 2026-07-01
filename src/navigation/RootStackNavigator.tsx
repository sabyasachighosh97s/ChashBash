import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import CommentsScreen from '../Community/CommentsScreen';
import LoginScreen from '../screens/LoginScreen';

import SplashScreen from '@screens/SplashScreen';
import DiseaseResultScreen from '../DrQube/DiseaseResultScreen';
import VisionCameraScreen from '../DrQube/VisionCameraScreen';
import WeatherDetailsScreen from '@screens/WeatherDetailsScreen';
import ShortRegistrationScreen from '@screens/ShortRegistrationScreen';
import CropRegistrationScreen from '@screens/CropRegistrationScreen';
import OtpVerificationScreen from '@screens/OtpVerificationScreen';

const Stack = createNativeStackNavigator();

const RootStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen
        name="ShortRegistration"
        component={ShortRegistrationScreen}
      />
      <Stack.Screen
        name="CropRegistration"
        component={CropRegistrationScreen}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="DiseaseResult" component={DiseaseResultScreen} />
      <Stack.Screen name="VisionCamera" component={VisionCameraScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="WeatherDetails" component={WeatherDetailsScreen} />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
