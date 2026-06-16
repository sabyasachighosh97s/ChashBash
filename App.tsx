import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';

import { lightTheme } from '@themes/lightTheme';
import RootStackNavigator from '@navigation/RootStackNavigator';
import { requestAppPermissions } from '@utils/permissions';

import './src/localization/i18n';

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    const granted = await requestAppPermissions();

    console.log('Permissions Granted =>', granted);
  };

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
