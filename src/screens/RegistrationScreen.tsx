import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Card, Button } from 'react-native-paper';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import Container from '@components/Container/Container';
import { CustomCard } from '@components/cards/CustomCard';
import { CustomStatusBar } from '@components/common/CustomStatusBar';
import { Rbutton } from '@components/common/Rbutton';
import { Paragraph } from '@components/ui';

import FormInput from '@components/forms/FormInput';
import FormdownInput from '@components/forms/FormdownInput';

import { CustomToast } from '@components/Toast';
import colors from '@themes/colors';

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
  const { user, userType, profileCompleted, cropCompleted, completeProfile } =
    useAuth();

  const isGuest = userType === 'guest';
  const isOtpUser = userType === 'otp';
  const isRegisteredUser = userType === 'registered';

  /*
  ==========================================
  Dynamic Screen Text
  ==========================================
  */

  const screenTitle = isRegisteredUser
    ? 'Edit Profile'
    : 'Complete Your Profile';

  const screenSubtitle = isRegisteredUser
    ? 'Update your farmer information.'
    : 'Complete your profile to access all farmer features.';

  const buttonTitle = isRegisteredUser ? 'Update Profile' : 'Complete Profile';

  /*
  ==========================================
  Form
  ==========================================
  */

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      farmerName: user.name,
      mobileNumber: user.phone,
      state: user.state,
      district: user.district,
      block: user.block,
    },

    // mode: 'onChange',

    // reValidateMode: 'onChange',
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

API Later
==========================================
*/

  const onSubmit = async (data: FormData) => {
    const profile = {
      name: data.farmerName,
      phone: data.mobileNumber,
      state: data.state,
      district: data.district,
      block: data.block,
    };

    await completeProfile(profile);

    CustomToast.success(
      isRegisteredUser
        ? 'Profile Updated Successfully'
        : 'Profile Completed Successfully',
    );

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainTabs',
        },
      ],
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
        <CustomCard style={styles.profileCard}>
          <Card.Content>
            {/* ==========================================
            Header
        ========================================== */}

            <Paragraph style={styles.title}>{screenTitle}</Paragraph>

            <Paragraph style={styles.subTitle}>{screenSubtitle}</Paragraph>
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: isRegisteredUser ? '#E8F5E9' : '#FFF8E1',
                paddingHorizontal: 14,
                paddingVertical: 5,
                borderRadius: 20,
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              <Paragraph
                style={{
                  color: isRegisteredUser ? '#2E7D32' : '#F57C00',
                  fontWeight: '700',
                }}
              >
                {isRegisteredUser ? 'Registered Farmer' : 'Profile Incomplete'}
              </Paragraph>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Paragraph
                style={{
                  fontSize: 13,
                  color: cropCompleted ? colors.success : colors.warning,
                  fontWeight: '700',
                }}
              >
                {cropCompleted
                  ? 'Crop Details Added'
                  : 'Crop Details Not Added'}
              </Paragraph>
            </View>
            {/* ==========================================
            Farmer Information
        ========================================== */}

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
              editable={isGuest}
              error={errors.mobileNumber}
            />

            {!isGuest && (
              <Paragraph
                style={{
                  fontSize: 12,
                  marginBottom: 14,
                  color: '#64748B',
                }}
              >
                Mobile number verified through OTP.
              </Paragraph>
            )}

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

            {/* ==========================================
            Crop Information
        ========================================== */}

            <Paragraph style={styles.sectionTitle}>
              Crop Information (Optional)
            </Paragraph>

            <Paragraph style={styles.optionalText}>
              Crop details are optional for profile completion.
              {'\n'}
              You can add your crop information later to access Dr. Qube and
              other crop-based services.
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
              {fields.length === 0 ? 'Add Crop' : 'Add Another Crop'}
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
          <View
            style={{
              marginHorizontal: 16,
              marginBottom: 20,
              backgroundColor: '#FFF8E1',
              borderRadius: 12,
              padding: 14,
            }}
          >
            <Paragraph
              style={{
                fontSize: 13,
                color: '#8A6D3B',
                lineHeight: 20,
              }}
            >
              Your profile will be completed even if you don't add crop details
              now.
              {'\n\n'}
              Crop details can be added later from your Profile.
            </Paragraph>
          </View>
          <Card.Actions style={styles.actionContainer}>
            {/* <Button
              mode="contained"
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
            >
              Submit Registration
            </Button> */}

            <Rbutton
              title={buttonTitle}
              buttonColor={colors.info}
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

    opacity: 0.7,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    // marginBottom: 10,
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
  profileCard: {
    marginTop: 20,
    borderRadius: 24,
    // paddingHorizontal: 22,
    paddingVertical: 10,
    alignItems: 'center',
    // marginBottom: 18,
  },
});
