import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';

import { Rbutton } from '@components/common/Rbutton';
import colors from '@themes/colors';
import { useAuth } from '../context/AuthContext';

const SplashScreen = ({ navigation }: any) => {
  const { loginAsGuest } = useAuth();

  /*
  ==========================================
  Get Started
  ==========================================
  */

  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  /*
  ==========================================
  Continue as Guest
  ==========================================
  */

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();

      // Navigation করবে না।
      // RootStackNavigator নিজে MainTabs দেখাবে।
    } catch (error) {
      console.log('Guest Login Error =>', error);
    }
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={require('@assets/images/splashScreen.png')}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.bottomSection}>
            <Rbutton
              title="Get Started"
              buttonColor={colors.textLight}
              textColor={colors.primary}
              onPress={handleGetStarted}
              style={styles.button}
            />

            <Rbutton
              title="Skip Login"
              buttonColor="transparent"
              textColor={colors.textLight}
              onPress={handleGuestLogin}
              style={styles.skipButton}
            />
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },

  button: {
    width: '100%',
    borderRadius: 30,
    marginBottom: 16,
  },

  skipButton: {
    width: '100%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});
