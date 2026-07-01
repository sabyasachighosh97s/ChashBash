import React from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { Container, Headline, Paragraph } from '@components/ui';
import { Rbutton } from '@components/common/Rbutton';
import colors from '@themes/colors';
const SplashScreen = ({ navigation }: any) => {
  const handleStart = () => {
    navigation.replace('Login');
  };
  const handleSkip = () => {
    navigation.replace('MainTabs');
  };
  return (
    <>
      <StatusBar />

      <ImageBackground
        source={require('@assets/images/splashScreen.png')}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.centerContent}>
          <Rbutton
            title="Get Started"
            buttonColor={colors.textLight}
            textColor={colors.primary}
            onPress={handleStart}
            style={styles.button}
          />
          <Rbutton
            title="Skip Login"
            buttonColor="transparent"
            textColor={colors.textLight}
            onPress={handleSkip}
            style={styles.skipButton}
          />
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

  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  centerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  logo: {
    width: 220,
    height: 220,
  },

  title: {
    marginTop: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 36,
    fontWeight: '700',
  },

  subtitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  bottomSection: {
    justifyContent: 'center',

    alignContent: 'center',
    paddingHorizontal: 24,
  },

  button: {
    borderRadius: 30,
    width: '100%',
    marginBottom: 16,
  },
  footerText: {
    marginTop: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  skipButton: {
    width: '100%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});
