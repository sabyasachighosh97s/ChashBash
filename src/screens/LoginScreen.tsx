import React, { useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import Container from '@components/Container/Container';
import { CustomCard } from '@components/cards/CustomCard';
import FormInput from '@components/forms/FormInput';
import { Paragraph } from '@components/ui';
import { CustomToast } from '@components/Toast';
import { CustomStatusBar } from '@components/common/CustomStatusBar';
import Logo from '../assets/images/Logo.png';
import { apiPost, apiGet } from '../api/client';
import { API_ROUTES } from '../api/routes';
import { useAuth } from '../context/AuthContext';
import { Rbutton } from '@components/common/Rbutton';

const createSchema = (t: any) =>
  z.object({
    mobileNumber: z
      .string()
      .min(10, t('invalid_mobile_number'))
      .max(10, t('invalid_mobile_number'))
      .regex(/^[0-9]+$/, t('only_numbers_allowed')),
    password: z.string().min(1, t('password_required')),
  });

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { t } = useTranslation();
  const { loginWithPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const schema = createSchema(t);

  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      mobileNumber: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await apiPost(
        API_ROUTES.POST.LOGIN,
        {
          mobile: data.mobileNumber,
          password: data.password,
        },
        undefined,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('login', response);
      const loginUser = response.data?.user;

      const accessToken = response.data?.access_token ?? '';

      // console.log('User ID:', loginUser?.id);
      // console.log('Token available:', !!accessToken);

      let cropCompleted = false;
      console.log('loginUser', loginUser);
      try {
        if (loginUser?.id && accessToken) {
          const userDetailsResponse = await apiGet(
            API_ROUTES.GET.USER_BY_ID(loginUser.id),
            accessToken,
          );

          const userDetails = userDetailsResponse.data;

          const lands = Array.isArray(userDetails?.lands)
            ? userDetails.lands
            : [];

          const totalLands = lands.length;

          const totalCrops = lands.reduce((total: number, land: any) => {
            const crops = Array.isArray(land?.crops) ? land.crops : [];

            return total + crops.length;
          }, 0);

          cropCompleted = totalCrops > 0;
        }
      } catch (cropError: any) {
        cropCompleted = false;
      }

      await loginWithPassword(
        response.data?.access_token ?? '',
        {
          id: loginUser?.id ?? '',
          name: loginUser?.name ?? '',
          phone: loginUser?.mobile ?? loginUser?.phone ?? '',
          email: loginUser?.email ?? '',
          state: loginUser?.state ?? '',
          district: loginUser?.district ?? '',
          block: loginUser?.subdivision ?? loginUser?.block ?? '',
          type: loginUser?.type ?? 'farmer',
          isActive: loginUser?.is_active ?? false,
          createdAt: loginUser?.created_at ?? '',
          stateID: loginUser?.state_id ?? '',
          districtID: loginUser?.district_id ?? '',
          blockID: loginUser?.subdivision_id ?? loginUser?.block_id ?? '',
          files: loginUser?.files ?? [],
        },
        cropCompleted,
      );

      CustomToast.success(t('login_successful'));
    } catch (error: any) {
  console.log('========== LOGIN ERROR ==========');

  console.log('Request URL:', API_ROUTES.POST.LOGIN);
  console.log('Status:', error?.response?.status);
  console.log('Response Data:', error?.response?.data);
  console.log('Error Message:', error?.message);

  if (error?.response) {
    console.log('Server responded with an error');
  } else if (error?.request) {
    console.log('Request sent but no response received');
  } else {
    console.log('Request setup error');
  }

  const errorData = error?.response?.data;

  const errorMessage =
    typeof errorData === 'string'
      ? errorData
      : errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        errorData?.errors?.password?.[0] ||
        errorData?.errors?.mobile?.[0] ||
        t('unable_to_login');

  CustomToast.error(errorMessage);
} finally {
  setLoading(false);
}
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
                {t('welcome_to_chashbash')}
              </Paragraph>

              <Paragraph
                style={[
                  styles.description,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                {t('login_description')}
              </Paragraph>
            </View>

            <FormInput
              control={control}
              name="mobileNumber"
              label={t('mobile_number')}
              keyboardType="number-pad"
              maxLength={10}
              icon="phone-outline"
              error={errors.mobileNumber}
            />
            <FormInput
              control={control}
              name="password"
              label={t('password')}
              secureTextEntry={!showPassword}
              icon={showPassword ? 'eye-off' : 'eye'}
              onIconPress={() => setShowPassword(prev => !prev)}
              error={errors.password}
            />
          </Card.Content>

          <Card.Actions style={styles.actionContainer}>
            <Rbutton
              title={loading ? t('logging_in') : t('login')}
              // style={styles.loginButton}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.skipContainer}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Paragraph
                style={{
                  color: theme.colors.primary,
                }}
              >
                {`← ${t('back')}`}
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
    fontSize: 12,
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
