import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Card, Button, useTheme } from 'react-native-paper';

import { useNavigation, useRoute } from '@react-navigation/native';

import Container from '@components/Container/Container';
import { CustomCard } from '@components/cards/CustomCard';
import { CustomStatusBar } from '@components/common/CustomStatusBar';
import { Paragraph } from '@components/ui';
import { CustomToast } from '@components/Toast';

import OtpInput from '@components/forms/OtpInput';

import Logo from '../assets/images/Logo.png';

import { useAuth } from '../context/AuthContext';

const OtpVerificationScreen = () => {
  const navigation = useNavigation<any>();

  const route = useRoute<any>();

  const theme = useTheme();

  const { loginWithOtp } = useAuth();

  const mobileNumber = route.params?.mobileNumber ?? '';

  const [otp, setOtp] = useState('');

  /*
  ==========================================
  Timer
  ==========================================
  */

  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds === 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  /*
  ==========================================
  Verify OTP

  Dummy OTP

  123456

  Replace API Later
  ==========================================
  */

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      CustomToast.error('Please enter 6 digit OTP');
      return;
    }

    if (otp !== '123456') {
      CustomToast.error('Invalid OTP');
      return;
    }

    /*
      API Later

      verifyOtpApi()

    */

    await loginWithOtp(mobileNumber);

    CustomToast.success('OTP Verified Successfully');

    /*
      Navigation করবে না।

      RootStackNavigator নিজে MainTabs দেখাবে।
    */
  };

  /*
  ==========================================
  Resend OTP
  ==========================================
  */

  const handleResendOtp = () => {
    setSeconds(30);

    CustomToast.success('OTP Sent Again');
  };

  return (
    <Container>
      <CustomStatusBar />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CustomCard>
          <Card.Content>
            <View style={styles.headerContainer}>
              <Image source={Logo} resizeMode="contain" style={styles.logo} />

              <Paragraph
                style={[
                  styles.title,
                  {
                    color: theme.colors.primary,
                  },
                ]}
              >
                OTP Verification
              </Paragraph>

              <Paragraph
                style={[
                  styles.description,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                Enter the OTP sent to
              </Paragraph>

              <Paragraph
                style={[
                  styles.mobileNumber,
                  {
                    color: theme.colors.primary,
                  },
                ]}
              >
                +91 {mobileNumber}
              </Paragraph>
            </View>

            <OtpInput value={otp} onChange={setOtp} />
          </Card.Content>

          <Card.Actions style={styles.actionContainer}>
            <Button
              mode="contained"
              style={styles.verifyButton}
              onPress={handleVerifyOtp}
            >
              Verify OTP
            </Button>

            <View style={styles.timerContainer}>
              {seconds > 0 ? (
                <Paragraph
                  style={{
                    color: theme.colors.onSurfaceVariant,
                  }}
                >
                  Resend OTP in {seconds}s
                </Paragraph>
              ) : (
                <TouchableOpacity activeOpacity={0.8} onPress={handleResendOtp}>
                  <Paragraph
                    style={{
                      color: theme.colors.primary,
                      fontWeight: '700',
                    }}
                  >
                    Resend OTP
                  </Paragraph>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                alignSelf: 'center',
                marginTop: 20,
              }}
              onPress={() => navigation.goBack()}
            >
              <Paragraph
                style={{
                  color: theme.colors.primary,
                }}
              >
                ← Change Mobile Number
              </Paragraph>
            </TouchableOpacity>
          </Card.Actions>
        </CustomCard>
      </ScrollView>
    </Container>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  description: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },

  mobileNumber: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  actionContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  verifyButton: {
    marginBottom: 16,
    borderRadius: 8,
  },

  timerContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
});
