import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Card, Button } from 'react-native-paper';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { apiGet, apiPost } from '../api/client';
import { API_ROUTES } from '../api/routes';
import { WHATSAPP_SERVICE_URL } from '../config/env';
import Container from '@components/Container/Container';
import { CustomCard } from '@components/cards/CustomCard';
import CustomHeader from '@components/Header/CustomHeader';
import { Rbutton } from '@components/common/Rbutton';
import { Paragraph } from '@components/ui';
import { useRoute } from '@react-navigation/native';
import FormInput from '@components/forms/FormInput';
import FormdownInput from '@components/forms/FormdownInput';

import { CustomToast } from '@components/Toast';
import colors from '@themes/colors';
import { useTranslation } from 'react-i18next';

const createSchema = (isGuest: boolean, t: any) =>
  z
    .object({
      farmerName: z.string().min(1, t('farmer_name_required')),

      mobileNumber: z
        .string()
        .min(10, t('mobile_number_required'))
        .max(10, t('mobile_number_must_be_10_digits')),

      password: isGuest
        ? z.string().min(1, t('password_required'))
        : z.string().optional(),

      confirmPassword: isGuest
        ? z.string().min(1, t('confirm_password_required'))
        : z.string().optional(),

      state: z.string().min(1, t('state_required')),

      district: z.string().min(1, t('district_required')),

      block: z.string().min(1, t('block_required')),

      crops: z.array(
        z.object({
          plotSize: z.string().optional(),
          cropType: z.string().optional(),
          cropName: z.string().optional(),
          cropVariety: z.string().optional(),
        }),
      ),
    })
    .refine(data => !isGuest || data.password === data.confirmPassword, {
      message: t('passwords_do_not_match'),
      path: ['confirmPassword'],
    });

type FormData = z.infer<ReturnType<typeof createSchema>>;

const RegistrationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();

  const editUser = route.params?.user ?? null;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    user,
    token,
    userType,
    profileCompleted,
    cropCompleted,
    completeProfile,
    completeCrop,
    loginWithOtp,
    logout,
  } = useAuth();

  const isGuest = userType === 'guest';

  const isEditMode = !isGuest && !!editUser;

  const isFirstLogin = !isGuest && !editUser;

  const isLocationEditable = isGuest || isFirstLogin;
  /*
  ==========================================
  Dynamic Screen Text
  ==========================================
  */

  const screenTitle = isEditMode
    ? t('edit_profile')
    : t('complete_your_profile');

  const screenSubtitle = isEditMode
    ? t('update_farmer_information')
    : t('complete_profile_subtitle');

  const buttonTitle = isEditMode
    ? t('update_profile')
    : isGuest
    ? t('register')
    : t('complete_profile');
  /*
  ==========================================
  Form
  ==========================================
  */

  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState<
    { label: string; value: string }[]
  >([]);
  const [subdivisionList, setSubdivisionList] = useState<
    { label: string; value: string }[]
  >([]);
  const [cropTypeMaster, setCropTypeMaster] = useState([]);
  const [cropNameList, setCropNameList] = useState<{
    [key: number]: { label: string; value: string }[];
  }>({});

  const [cropVarietyList, setCropVarietyList] = useState<{
    [key: number]: { label: string; value: string }[];
  }>({});

  const {
    control,
    watch,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createSchema(isGuest, t)),

    defaultValues: {
      farmerName: isGuest ? '' : editUser?.name ?? user?.name ?? '',
      mobileNumber: isGuest ? '' : editUser?.phone ?? user?.phone ?? '',
      password: '',
      confirmPassword: '',
      state: isGuest ? '' : editUser?.state ?? user?.state ?? '',

      district: isGuest ? '' : editUser?.district ?? user?.district ?? '',

      block: isGuest ? '' : editUser?.block ?? user?.block ?? '',
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
  useEffect(() => {
    fetchInitialData();
    if (!isEditMode) {
      return;
    }
    reset({
      farmerName: editUser.name ?? '',
      mobileNumber: editUser.phone ?? '',
      // state: editUser.state ?? '',
      // district: editUser.district ?? '',
      // block: editUser.block ?? '',
      state: editUser.stateID ?? '',
      district: editUser.districtID ?? '',
      block: editUser.blockID ?? '',
      crops: [],
    });
  }, [editUser, isEditMode, reset]);

  const fetchInitialData = async () => {
    try {
      const stateRes = await apiGet(API_ROUTES.GET.STATES, token, {
        params: {
          lang_id: 1,
        },
      });

      if (stateRes?.status == 200) {
        setStateList(
          stateRes.data.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        );
      }

      if (editUser?.stateID) {
        await getDistrictList(editUser.stateID);
      }

      if (editUser?.districtID) {
        await getSubdivisionList(editUser.districtID);
      }

      const cropTypeRes = await apiGet(API_ROUTES.GET.CROP_TYPES, token, {
        params: {
          lang_id: 1,
        },
      });
      if (cropTypeRes?.status == 200) {
        setCropTypeMaster(
          cropTypeRes.data.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        );
      }
    } catch (error) {
      console.log('Initial data error', error);
    }
  };

  const getDistrictList = async (stateId: string) => {
    try {
      const districts = await apiGet(API_ROUTES.GET.DISTRICTS, token, {
        params: {
          state_id: stateId,
          lang_id: 1,
        },
      });
      if (districts?.status == 200) {
        setDistrictList(
          districts?.data?.map((item: any) => ({
            label: item.name,
            value: item.id.toString(),
          })) || [],
        );
      }
    } catch (error: any) {
      console.log(
        'District API Error:',
        error?.response?.status,
        error?.response?.data,
      );
    }
  };
  const getSubdivisionList = async (districtId: string) => {
    try {
      const subdivisions = await apiGet(API_ROUTES.GET.SUBDIVISIONS, token, {
        params: {
          district_id: districtId,
          lang_id: 1,
        },
      });

      if (subdivisions?.status == 200) {
        setSubdivisionList(
          subdivisions?.data?.map((item: any) => ({
            label: item.name,
            value: item.id,
          })) || [],
        );
      }
    } catch (error: any) {
      console.log('Data:', error?.response?.data);
    }
  };
  const getCropNameList = async (cropTypeId: string, index: number) => {
    try {
      const cropNames = await apiGet(API_ROUTES.GET.CROP_NAMES, token, {
        params: {
          crop_type_id: cropTypeId,
          lang_id: 1,
        },
      });

      if (cropNames.status === 200) {
        setCropNameList(prev => ({
          ...prev,
          [index]:
            cropNames.data?.map((item: any) => ({
              label: item.name,
              value: item.id,
            })) || [],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getCropVarietyList = async (cropId: string, index: number) => {
    try {
      const varieties = await apiGet(API_ROUTES.GET.CROP_VARIETIES, token, {
        params: {
          crop_name_id: cropId,
          lang_id: 1,
        },
      });
      if (varieties.status === 200) {
        setCropVarietyList(prev => ({
          ...prev,
          [index]:
            varieties.data?.map((item: any) => ({
              label: item.name,
              value: item.id,
            })) || [],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  // ==========================================
  // REGISTRATION SUCCESS WHATSAPP
  // ==========================================

  // const sendRegistrationWhatsApp = async (
  //   phoneNumber: string,
  //   farmerName: string,
  // ) => {
  //   try {
  //     const response = await fetch(
  //       `${WHATSAPP_SERVICE_URL}api/v1/whatsapp/registration-success`,
  //       {
  //         method: 'POST',

  //         headers: {
  //           'Content-Type': 'application/json',
  //         },

  //         body: JSON.stringify({
  //           phoneNumber,
  //           farmerName,
  //         }),
  //       },
  //     );

  //     const responseData = await response.json();

  //     console.log(
  //       'REGISTRATION WHATSAPP RESPONSE:',
  //       JSON.stringify(responseData, null, 2),
  //     );

  //     if (!response.ok) {
  //       console.error('REGISTRATION WHATSAPP FAILED:', responseData);

  //       return false;
  //     }

  //     return true;
  //   } catch (error: any) {
  //     console.error(
  //       'REGISTRATION WHATSAPP API ERROR:',
  //       error?.message || error,
  //     );

  //     return false;
  //   }
  // };

  const onSubmit = async (data: FormData) => {
    // ==========================
    // EDIT MODE
    // ==========================
    if (isEditMode) {
      try {
        setLoading(true);

        data.crops.forEach((crop, index) => {});

        const payload = data.crops.map(crop => ({
          plot_size: Number(crop.plotSize),
          crop_type_id: crop.cropType,
          crop_name_id: crop.cropName,
          crop_variety_id: crop.cropVariety,
        }));

        const response = await apiPost(API_ROUTES.POST.CROPS, payload, token, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Immediately update AuthContext
        await completeCrop();

        CustomToast.success('Crop details saved successfully');

        navigation.goBack();
      } catch (error: any) {
        console.log('Data:', error?.response?.data);

        CustomToast.error(
          error?.response?.data?.detail ||
            error?.response?.data?.message ||
            'Failed to save crop details',
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // ==========================
    // REGISTER MODE
    // ==========================
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('name', data.farmerName);

      formData.append('mobile', data.mobileNumber);

      formData.append('email', '');

      formData.append('password', data.password ?? '');

      formData.append('type', 'farmer');

      // =========================
      // Location Details
      // =========================

      formData.append('state_id', data.state);

      formData.append('district_id', data.district);

      formData.append('subdivision_id', data.block);

      const cropsPayload = (data.crops || [])
        .filter(
          crop =>
            crop.plotSize || crop.cropType || crop.cropName || crop.cropVariety,
        )
        .map(crop => ({
          plot_size: Number(crop.plotSize || 0),
          crop_type_id: crop.cropType || '',
          crop_name_id: crop.cropName || '',
          crop_variety_id: crop.cropVariety || '',
        }));

      formData.append('crops', JSON.stringify(cropsPayload));

      const response = await apiPost(
        API_ROUTES.POST.REGISTER,
        formData,
        undefined,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // ==========================================
      // SEND REGISTRATION SUCCESS WHATSAPP
      // ==========================================

      // const whatsappSent = await sendRegistrationWhatsApp(
      //   response.data.mobile,
      //   response.data.name,
      // );

      // console.log('Registration WhatsApp Sent:', whatsappSent);

      await completeProfile({
        id: response.data.id,
        name: response.data.name,
        phone: response.data.mobile,
        email: response.data.email ?? '',
        state: response.data.state,
        district: response.data.district,
        block: response.data.subdivision,
        type: response.data.type,
        isActive: response.data.is_active,
        createdAt: response.data.created_at,
        stateID: response.data.state_id,
        districtID: response.data.district_id,
        blockID: response.data.subdivision_id,
      });

      CustomToast.success('Registration Successful');

      logout();

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
          },
        ],
      });
    } catch (error: any) {
      console.log('RESPONSE DATA:', error?.response?.data);

      const errorData = error?.response?.data;

      if (error?.response?.status == 500) {
        CustomToast.error(t('Please_EntaireMinimum_8Cha_pass'));
      } else {
        const errorMessage =
          typeof errorData === 'string'
            ? errorData
            : errorData?.detail ||
              errorData?.message ||
              errorData?.error ||
              errorData?.errors?.password?.[0] ||
              errorData?.errors?.mobile?.[0] ||
              errorData?.errors?.name?.[0] ||
              errorData?.errors?.state_id?.[0] ||
              errorData?.errors?.district_id?.[0] ||
              errorData?.errors?.subdivision_id?.[0] ||
              'Registration Failed';

        CustomToast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (errors: any) => {
    console.log(JSON.stringify(errors, null, 2));
  };

  return (
    <Container>
      <CustomHeader />
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
                backgroundColor: isGuest ? '#FFF8E1' : '#E8F5E9',
                paddingHorizontal: 14,
                paddingVertical: 5,
                borderRadius: 20,
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              <Paragraph
                style={{
                  color: isGuest ? '#F57C00' : '#2E7D32',
                  fontWeight: '700',
                }}
              >
                {isGuest ? t('guest_farmer') : t('registered_farmer')}
              </Paragraph>
            </View>
            {/* <View
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
            </View> */}
            {/* ==========================================
            Farmer Information
        ========================================== */}

            <Paragraph style={styles.sectionTitle}>
              {t('farmer_information')}
            </Paragraph>

            <FormInput
              control={control}
              name="farmerName"
              label={t('farmer_name')}
              error={errors.farmerName}
            />

            <FormInput
              control={control}
              name="mobileNumber"
              label={t('mobile_number')}
              keyboardType="number-pad"
              maxLength={10}
              editable={isGuest}
              error={errors.mobileNumber}
            />

            {isGuest && (
              <>
                <FormInput
                  control={control}
                  name="password"
                  label={t('password')}
                  secureTextEntry={!showPassword}
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onIconPress={() => setShowPassword(prev => !prev)}
                  error={errors.password}
                />

                <FormInput
                  control={control}
                  name="confirmPassword"
                  label={t('confirm_password')}
                  secureTextEntry={!showConfirmPassword}
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onIconPress={() => setShowConfirmPassword(prev => !prev)}
                  error={errors.confirmPassword}
                />
              </>
            )}

            {!isGuest && (
              <Paragraph
                style={{
                  fontSize: 12,
                  marginBottom: 14,
                  color: '#64748B',
                }}
              >
                {t('mobile_verified_cannot_change')}
              </Paragraph>
            )}

            <FormdownInput
              control={control}
              name="state"
              labelText={t('state')}
              disabled={!isLocationEditable}
              data={stateList}
              error={errors.state}
              onSelect={value => {
                getDistrictList(value);
              }}
            />
            {/* <FormInput
              control={control}
              name="state"
              label="State"
              error={errors.state}
            /> */}

            <FormdownInput
              control={control}
              name="district"
              labelText={t('district')}
              data={districtList}
              disabled={!isLocationEditable || !selectedState}
              error={errors.district}
              onSelect={value => {
                getSubdivisionList(value);
              }}
            />

            {/* <FormInput
              control={control}
              name="district"
              label="District"
              error={errors.district}
            /> */}

            <FormdownInput
              control={control}
              name="block"
              labelText={t('block')}
              data={subdivisionList}
              disabled={!isLocationEditable || !selectedDistrict}
              error={errors.block}
            />

            {/* ==========================================
            Crop Information
        ========================================== */}

            <Paragraph style={styles.sectionTitle}>
              {t('crop_information_optional')}
            </Paragraph>

            <Paragraph style={styles.optionalText}>
              {t('crop_details_optional')}
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
              {fields.length === 0 ? t('add_crop') : t('add_another_crop')}
            </Button>
          </Card.Content>
          {/* =========================
                Dynamic Crop List
            ========================== */}

          {fields.map((item, index) => {
            const selectedCropType = watch(`crops.${index}.cropType`);

            const selectedCropName = watch(`crops.${index}.cropName`);

            // const cropNameOptions = cropNameMaster
            //   .filter(crop => crop.cropType === selectedCropType)
            //   .map(crop => ({
            //     label: crop.label,
            //     value: crop.value,
            //   }));

            // const varietyOptions = varietyMaster
            //   .filter(variety => variety.crop === selectedCropName)
            //   .map(variety => ({
            //     label: variety.label,
            //     value: variety.value,
            //   }));

            return (
              <Card key={item.id} mode="outlined" style={styles.cropCard}>
                <Card.Title
                  title={`${t('crop')} ${index + 1}`}
                  right={() => (
                    <Button
                      compact
                      textColor="red"
                      onPress={() => remove(index)}
                    >
                      {t('remove')}
                    </Button>
                  )}
                />

                <Card.Content>
                  <FormInput
                    control={control}
                    name={`crops.${index}.plotSize`}
                    label={t('plot_size_bigha')}
                    keyboardType="decimal-pad"
                  />

                  <FormdownInput
                    control={control}
                    name={`crops.${index}.cropType`}
                    labelText={t('crop_type')}
                    data={cropTypeMaster}
                    onSelect={value => {
                      getCropNameList(value, index);
                    }}
                  />

                  <FormdownInput
                    control={control}
                    name={`crops.${index}.cropName`}
                    labelText={t('crop_name')}
                    data={cropNameList[index] || []}
                    disabled={!selectedCropType}
                    onSelect={value => {
                      getCropVarietyList(value, index);
                    }}
                  />

                  <FormdownInput
                    control={control}
                    name={`crops.${index}.cropVariety`}
                    labelText={t('crop_variety')}
                    data={cropVarietyList[index] || []}
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
                fontSize: 12,
                color: '#8A6D3B',
                lineHeight: 18,
              }}
            >
              {t('profile_complete_without_crop')}
              {'\n'}
              {t('crop_details_later_profile')}
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
              title={loading ? t('registering') : buttonTitle}
              buttonColor={colors.info}
              onPress={handleSubmit(onSubmit, onInvalid)}
              style={styles.submitButton}
              disabled={loading}
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
    padding: 18,
    paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  paddingTop:5 },

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
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 18,
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
    // marginTop: 10,
    borderRadius: 24,
    // paddingHorizontal: 22,
    paddingVertical: 10,
    alignItems: 'center',
    // marginBottom: 18,
  },
});
