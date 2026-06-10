import React, { useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Card, Button, useTheme } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import z from 'zod';
import { BackgroundImage } from '../components/common/BackgroundImage';
import { CustomStatusBar } from '../components/common/CustomStatusBar';
import backgroundImage from '../assets/images/background.jpg';
import { useTranslation } from 'react-i18next';
import Container from '@components/Container/Container';
import { CustomCard } from '@components/cards/CustomCard';
import { CustomToast } from '@components/Toast';
import Headline from '@components/common/Headline';
import { Paragraph } from '@components/ui';
import FormInput from '@components/forms/FormInput';
import FormdownInput from '@components/forms/FormdownInput';
import Logo from '../assets/images/Logo.png';
import { Image } from 'react-native';
const schema = z.object({
  company: z.string().min(1, 'Please select company'),

  email: z
    .string()
    .min(1, 'Email / Mobile required')
    .email('Invalid email address'),

  password: z.string().min(6, 'Password must be at least 6 characters'),

  language: z.string().min(1, 'Please select language'),
});

type FormData = z.infer<typeof schema>;

const LoginScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      company: '',
      email: '',
      password: '',
      language: '',
    },

    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const companyOptions = useMemo(
    () => [
      {
        label: 'ChashBash Agro',
        value: 'chashbash',
      },
      {
        label: 'GreenQube',
        value: 'greenqube',
      },
    ],
    [],
  );

  const languageOptions = useMemo(
    () => [
      {
        label: t('english'),
        value: 'en',
      },
      {
        label: t('bangla'),
        value: 'bn',
      },
    ],
    [],
  );

  const onSubmit = (data: FormData) => {
    console.log(data);

    CustomToast.success(t('login_successful'));

    navigation.replace('MainTabs');
  };

  return (
    <Container>
      <CustomStatusBar />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <CustomCard>
          <Card.Content>
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <Image source={Logo} style={styles.logo} resizeMode="contain" />
              </View>

              <Paragraph
                lineHeight={20}
                // variant="body"
                style={[styles.subTitle, { color: theme.colors.primary }]}
              >
                {t('smart_farming_platform')}
              </Paragraph>

              <Paragraph
                // variant="body"
                style={[styles.description, { color: theme.colors.onSurface }]}
              >
                {t('app_description')}
              </Paragraph>
            </View>

            <FormdownInput
              control={control}
              name="company"
              labelText={t('company_name')}
              data={companyOptions}
              error={errors.company}
            />

            <FormInput
              control={control}
              name="email"
              label={t('email_mobile')}
              keyboardType="email-address"
              icon="email-outline"
              error={errors.email}
            />

            <FormInput
              control={control}
              name="password"
              label={t('password')}
              secureTextEntry
              icon="lock-outline"
              error={errors.password}
            />

            <FormdownInput
              control={control}
              name="language"
              labelText={t('language')}
              data={languageOptions}
              error={errors.language}
            />
          </Card.Content>

          <Card.Actions style={styles.actionContainer}>
            <Button
              mode="contained"
              style={styles.loginButton}
              onPress={handleSubmit(onSubmit)}
            >
              {t('login')}
            </Button>

            <Button mode="text" onPress={() => navigation.navigate('MainTabs')}>
              {t('continue_guest')}
            </Button>
          </Card.Actions>
        </CustomCard>
      </ScrollView>
    </Container>
    // </BackgroundImage>
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

  subTitle: {
    // marginTop: 8,
    fontSize: 16,
  },

  description: {
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },

  actionContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  loginButton: {
    marginBottom: 8,
  },
  logoContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 120,
    height: 120,
    // marginRight: 10,
  },
});
