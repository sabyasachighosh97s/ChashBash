import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import AppProvider from './src/context/AppContext';
import AuthProvider from './src/context/AuthContext';
import { lightTheme } from '@themes/lightTheme';
import RootStackNavigator from '@navigation/RootStackNavigator';
import { requestAppPermissions } from '@utils/permissions';
import { navigationRef } from '@navigation/fab/fabNavigator';
import { AppUpdateProvider } from './src/context/AppUpdateContext';
import './src/localization/i18n';

const queryClient = new QueryClient();

export default function App() {
  console.log('App Render');
console.log(
  'Hermes Enabled:',
  typeof HermesInternal === 'object'
);  useEffect(() => {
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
          <AppProvider>
            <AuthProvider>
              <AppUpdateProvider>
              <NavigationContainer ref={navigationRef}>
                <RootStackNavigator />
              </NavigationContainer>
              </AppUpdateProvider>
            </AuthProvider>
          </AppProvider>
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
