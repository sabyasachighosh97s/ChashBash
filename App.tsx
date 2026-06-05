import 'react-native-gesture-handler';

import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Provider as PaperProvider } from 'react-native-paper';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { NavigationContainer } from '@react-navigation/native';

import BottomTabNavigator from '@navigation/BottomTabNavigator';

import { lightTheme } from '@themes/lightTheme';

import './src/localization/i18n';
import RootStackNavigator from '@navigation/RootStackNavigator';
/*
=====================================
REACT QUERY
=====================================
*/

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={lightTheme}>
          <NavigationContainer>
            <RootStackNavigator />
          </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
