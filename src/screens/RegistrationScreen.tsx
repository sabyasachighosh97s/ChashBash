import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Button, useTheme } from 'react-native-paper';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { CustomToast } from '@components/Toast';
import Container from '@components/Container/Container';
import { CustomCard } from '@components/cards/CustomCard';
import FormInput from '@components/forms/FormInput';
import FormdownInput from '@components/forms/FormdownInput';
import { Paragraph } from '@components/ui';
import { CustomStatusBar } from '@components/common/CustomStatusBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Rbutton } from '@components/common/Rbutton';

const schema = z.object({
  farmerName: z.string().min(1, 'Farmer Name is required'),

  mobileNumber: z
    .string()
    .min(10, 'Mobile Number is required')
    .max(10, 'Mobile Number must be 10 digits'),

  state: z.string().min(1, 'State is required'),

  district: z.string().min(1, 'District is required'),

  block: z.string().min(1, 'Block is required'),

  crops: z.array(
    z.object({
      plotSize: z.string().optional(),

      cropType: z.string().optional(),

      cropName: z.string().optional(),

      cropVariety: z.string().optional(),
    }),
  ),
});

type FormData = z.infer<typeof schema>;

const RegistrationScreen = () => {
  const navigation = useNavigation<any>();
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      farmerName: '',
      mobileNumber: '',
      state: '',
      district: '',
      block: '',

      crops: [],
    },

    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  /*
  ==========================================
  Dynamic Crop
  ==========================================
  */

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'crops',
  });

  /*
  ==========================================
  Dummy Data

  Replace with API Later
  ==========================================
  */

  const stateList = useMemo(
    () => [
      {
        label: 'West Bengal',
        value: 'wb',
      },
      {
        label: 'Bihar',
        value: 'br',
      },
    ],
    [],
  );

  const districtMaster = [
    {
      state: 'wb',
      label: 'Kolkata',
      value: 'kolkata',
    },
    {
      state: 'wb',
      label: 'Howrah',
      value: 'howrah',
    },
    {
      state: 'br',
      label: 'Patna',
      value: 'patna',
    },
  ];

  const blockMaster = [
    {
      district: 'kolkata',
      label: 'Behala',
      value: 'behala',
    },
    {
      district: 'kolkata',
      label: 'Kasba',
      value: 'kasba',
    },
    {
      district: 'howrah',
      label: 'Bally',
      value: 'bally',
    },
    {
      district: 'patna',
      label: 'Danapur',
      value: 'danapur',
    },
  ];

  const cropTypeMaster = [
    {
      label: 'Vegetable',
      value: 'vegetable',
    },
    {
      label: 'Fruit',
      value: 'fruit',
    },
    {
      label: 'Grain',
      value: 'grain',
    },
  ];

  const cropNameMaster = [
    {
      cropType: 'vegetable',
      label: 'Potato',
      value: 'potato',
    },
    {
      cropType: 'vegetable',
      label: 'Tomato',
      value: 'tomato',
    },
    {
      cropType: 'fruit',
      label: 'Mango',
      value: 'mango',
    },
    {
      cropType: 'grain',
      label: 'Rice',
      value: 'rice',
    },
  ];

  const varietyMaster = [
    {
      crop: 'potato',
      label: 'Jyoti',
      value: 'jyoti',
    },
    {
      crop: 'tomato',
      label: 'Hybrid',
      value: 'hybrid',
    },
    {
      crop: 'mango',
      label: 'Himsagar',
      value: 'himsagar',
    },
    {
      crop: 'rice',
      label: 'Swarna',
      value: 'swarna',
    },
  ];

  /*
  ==========================================
  Cascading Dropdown
  ==========================================
  */

  const selectedState = watch('state');

  const selectedDistrict = watch('district');

  const districtOptions = useMemo(() => {
    return districtMaster
      .filter(item => item.state === selectedState)
      .map(item => ({
        label: item.label,
        value: item.value,
      }));
  }, [selectedState]);

  const blockOptions = useMemo(() => {
    return blockMaster
      .filter(item => item.district === selectedDistrict)
      .map(item => ({
        label: item.label,
        value: item.value,
      }));
  }, [selectedDistrict]);
  /*
  ==========================================
  Submit
  ==========================================
  */

  const onSubmit = (data: FormData) => {
    console.log('Registration Data');
    console.log(data);

    /*
    API Later

    registrationApi(data)
  */

    CustomToast.success(
      'Registration completed successfully.\nPlease login with your mobile number.',
    );

    setTimeout(() => {
      navigation.replace('Login');
    }, 1500);
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
            <Paragraph style={styles.title}>Farmer Registration</Paragraph>

            <Paragraph style={styles.subTitle}>
              Fill your basic information first.
            </Paragraph>

            {/* =========================
                Farmer Information
            ========================== */}

            <Paragraph style={styles.sectionTitle}>
              Farmer Information
            </Paragraph>

            <FormInput
              control={control}
              name="farmerName"
              label="Farmer Name"
              error={errors.farmerName}
            />

            <FormInput
              control={control}
              name="mobileNumber"
              label="Mobile Number"
              keyboardType="number-pad"
              maxLength={10}
              error={errors.mobileNumber}
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

            {/* =========================
                Crop Section
            ========================== */}

            <Paragraph style={styles.sectionTitle}>
              Crop / Plot Information
            </Paragraph>

            <Paragraph style={styles.optionalText}>
              This section is optional. You can add crop information now or
              later.
            </Paragraph>

            <Button
              mode="outlined"
              icon="plus"
              style={styles.addCropButton}
              onPress={() =>
                append({
                  plotSize: '',
                  cropType: '',
                  cropName: '',
                  cropVariety: '',
                })
              }
            >
              Add Crop
            </Button>
          </Card.Content>
          {/* =========================
                Dynamic Crop List
            ========================== */}

          {fields.map((item, index) => {
            const selectedCropType = watch(`crops.${index}.cropType`);

            const selectedCropName = watch(`crops.${index}.cropName`);

            const cropNameOptions = cropNameMaster
              .filter(crop => crop.cropType === selectedCropType)
              .map(crop => ({
                label: crop.label,
                value: crop.value,
              }));

            const varietyOptions = varietyMaster
              .filter(variety => variety.crop === selectedCropName)
              .map(variety => ({
                label: variety.label,
                value: variety.value,
              }));

            return (
              <Card key={item.id} mode="outlined" style={styles.cropCard}>
                <Card.Title
                  title={`Crop ${index + 1}`}
                  right={() => (
                    <Button
                      compact
                      textColor="red"
                      onPress={() => remove(index)}
                    >
                      Remove
                    </Button>
                  )}
                />

                <Card.Content>
                  <FormInput
                    control={control}
                    name={`crops.${index}.plotSize`}
                    label="Plot Size (Bigha)"
                    keyboardType="decimal-pad"
                  />

                  <FormdownInput
                    control={control}
                    name={`crops.${index}.cropType`}
                    labelText="Crop Type"
                    data={cropTypeMaster}
                  />

                  <FormdownInput
                    control={control}
                    name={`crops.${index}.cropName`}
                    labelText="Crop Name"
                    data={cropNameOptions}
                    disabled={!selectedCropType}
                  />

                  <FormdownInput
                    control={control}
                    name={`crops.${index}.cropVariety`}
                    labelText="Crop Variety"
                    data={varietyOptions}
                    disabled={!selectedCropName}
                  />
                </Card.Content>
              </Card>
            );
          })}

          <Card.Actions style={styles.actionContainer}>
            {/* <Button
              mode="contained"
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
            >
              Submit Registration
            </Button> */}

            <Rbutton
              title=" Submit Registration"
              buttonColor="#1565C0"
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            />
          </Card.Actions>
        </CustomCard>
      </ScrollView>
    </Container>
  );
};

export default RegistrationScreen;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },

  subTitle: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 24,
    opacity: 0.7,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 12,
  },

  optionalText: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 20,
  },

  addCropButton: {
    marginBottom: 20,
    borderRadius: 10,
  },

  cropCard: {
    marginBottom: 20,
    borderRadius: 14,
  },

  actionContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  submitButton: {
    borderRadius: 10,
  },
});
