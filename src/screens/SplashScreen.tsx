import React, { useEffect } from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';

import { Rbutton } from '@components/common/Rbutton';
import colors from '@themes/colors';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const SplashScreen = ({ navigation }: any) => {
  const { loginAsGuest } = useAuth();
  const { t } = useTranslation();



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
              title={t('get_started')}
              buttonColor="rgba(244, 244, 244, 0.85)"
              textColor={colors.primary}
              onPress={handleGetStarted}
              style={styles.button}
            />

            <Rbutton
              title={t('continue_guest')}
              buttonColor="rgba(0, 0, 0, 0.6)"
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
