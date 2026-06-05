import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import CommentsScreen from '../Community/CommentsScreen';
import LoginScreen from '../screens/LoginScreen';
import DiseaseResultScreen from '@screens/DiseaseResultScreen';

const Stack = createNativeStackNavigator();

const RootStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="DiseaseResult" component={DiseaseResultScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

      <Stack.Screen name="Comments" component={CommentsScreen} />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
