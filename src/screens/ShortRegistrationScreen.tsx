import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useTranslation } from 'react-i18next';

import Container from '@components/Container/Container';
import { CustomCard } from '@components/cards/CustomCard';
import FormInput from '@components/forms/FormInput';
import FormdownInput from '@components/forms/FormdownInput';
import { Paragraph } from '@components/ui';

const schema = z.object({
  farmerName: z.string().min(1, 'Farmer Name is required'),

  phoneNumber: z
    .string()
    .min(10, 'Phone Number must be 10 digits')
    .max(10, 'Phone Number must be 10 digits'),

  state: z.string().min(1, 'Please select State'),

  district: z.string().min(1, 'Please select District'),

  block: z.string().min(1, 'Please select Block'),
});

type FormData = z.infer<typeof schema>;

const ShortRegistrationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      farmerName: '',
      phoneNumber: '',
      state: '',
      district: '',
      block: '',
    },

    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  /*
  ====================================================
  TEMPORARY DUMMY DATA
  Replace with API later
  ====================================================
  */

  const stateList = [
    {
      label: 'West Bengal',
      value: 'wb',
    },
    {
      label: 'Odisha',
      value: 'od',
    },
  ];

  const districtMaster = [
    {
      label: 'Kolkata',
      value: 'kolkata',
      state: 'wb',
    },
    {
      label: 'Howrah',
      value: 'howrah',
      state: 'wb',
    },
    {
      label: 'Bhubaneswar',
      value: 'bbsr',
      state: 'od',
    },
  ];

  const blockMaster = [
    {
      label: 'Barasat',
      value: 'barasat',
      district: 'kolkata',
    },
    {
      label: 'Salt Lake',
      value: 'saltlake',
      district: 'kolkata',
    },
    {
      label: 'Domjur',
      value: 'domjur',
      district: 'howrah',
    },
    {
      label: 'Patia',
      value: 'patia',
      district: 'bbsr',
    },
  ];

  /*
  ====================================================
  WATCH VALUES
  ====================================================
  */

  const selectedState = watch('state');
  const selectedDistrict = watch('district');

  /*
  ====================================================
  FILTERED DROPDOWNS
  ====================================================
  */

  const districtOptions = useMemo(() => {
    if (!selectedState) return [];

    return districtMaster
      .filter(item => item.state === selectedState)
      .map(item => ({
        label: item.label,
        value: item.value,
      }));
  }, [selectedState]);

  const blockOptions = useMemo(() => {
    if (!selectedDistrict) return [];

    return blockMaster
      .filter(item => item.district === selectedDistrict)
      .map(item => ({
        label: item.label,
        value: item.value,
      }));
  }, [selectedDistrict]);

  /*
  ====================================================
  RESET DEPENDENT DROPDOWNS
  ====================================================
  */

  useEffect(() => {
    setValue('district', '');
    setValue('block', '');
  }, [selectedState]);

  useEffect(() => {
    setValue('block', '');
  }, [selectedDistrict]);

  /*
  ====================================================
  SUBMIT
  ====================================================
  */

  const onSubmit = (data: FormData) => {
    console.log(data);

    navigation.navigate('CropRegistration', {
      registrationData: data,
    });
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CustomCard>
          <Card.Content>
            <View style={styles.headerContainer}>
              <Paragraph
                style={[
                  styles.title,
                  {
                    color: theme.colors.primary,
                  },
                ]}
              >
                Short Registration
              </Paragraph>

              <Paragraph
                style={[
                  styles.subTitle,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                Register Farmer Details
              </Paragraph>
            </View>

            <FormInput
              control={control}
              name="farmerName"
              label="Farmer Name"
              error={errors.farmerName}
            />

            <FormInput
              control={control}
              name="phoneNumber"
              label="Phone Number"
              keyboardType="number-pad"
              maxLength={10}
              error={errors.phoneNumber}
            />

            <FormdownInput
              control={control}
              name="state"
              labelText="State"
              data={stateList}
              error={errors.state}
            />

            <FormdownInput
              control={control}
              name="district"
              labelText="District"
              data={districtOptions}
              disabled={!selectedState}
              error={errors.district}
            />

            <FormdownInput
              control={control}
              name="block"
              labelText="Block"
              data={blockOptions}
              disabled={!selectedDistrict}
              error={errors.block}
            />
          </Card.Content>

          <Card.Actions style={styles.actionContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.button}
            >
              Continue
            </Button>
          </Card.Actions>
        </CustomCard>
      </ScrollView>
    </Container>
  );
};

export default ShortRegistrationScreen;
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

  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  subTitle: {
    marginTop: 8,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  actionContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },

  button: {
    marginTop: 8,
    borderRadius: 8,
  },
});
