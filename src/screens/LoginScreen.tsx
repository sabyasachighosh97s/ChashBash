import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Card, Button, useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import Container from '@components/Container/Container';

import { CustomCard } from '@components/cards/CustomCard';

import FormInput from '@components/forms/FormInput';

import { Paragraph } from '@components/ui';

import { CustomToast } from '@components/Toast';

import { CustomStatusBar } from '@components/common/CustomStatusBar';

import Logo from '../assets/images/Logo.png';

const schema = z.object({
  mobileNumber: z
    .string()
    .min(10, 'Please enter a valid mobile number')
    .max(10, 'Please enter a valid mobile number')
    .regex(/^[0-9]+$/, 'Only numbers are allowed'),
});

type FormData = z.infer<typeof schema>;

const LoginScreen = () => {
  const navigation = useNavigation<any>();

  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      mobileNumber: '',
    },
  });

  /*
  ==========================================
  GET OTP

  API Later

  sendOtpApi()

  ==========================================
  */

  const onSubmit = (data: FormData) => {
    console.log('Mobile =>', data.mobileNumber);

    CustomToast.success('OTP Sent Successfully');

    navigation.navigate('OtpVerification', {
      mobileNumber: data.mobileNumber,
    });
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
                Welcome to ChashBash
              </Paragraph>

              <Paragraph
                style={[
                  styles.description,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                Enter your mobile number to continue
              </Paragraph>
            </View>

            <FormInput
              control={control}
              name="mobileNumber"
              label="Mobile Number"
              keyboardType="number-pad"
              maxLength={10}
              icon="phone-outline"
              error={errors.mobileNumber}
            />
          </Card.Content>

          <Card.Actions style={styles.actionContainer}>
            <Button
              mode="contained"
              style={styles.loginButton}
              onPress={handleSubmit(onSubmit)}
            >
              Get OTP
            </Button>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.skipContainer}
              onPress={() => navigation.goBack()}
            >
              <Paragraph
                style={{
                  color: theme.colors.primary,
                }}
              >
                ← Back
              </Paragraph>
            </TouchableOpacity>
          </Card.Actions>
        </CustomCard>
      </ScrollView>
    </Container>
  );
};

export default LoginScreen;

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
    fontSize: 14,
    lineHeight: 22,
  },

  actionContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  loginButton: {
    borderRadius: 8,
    marginBottom: 16,
  },

  skipContainer: {
    alignItems: 'center',
  },
});
