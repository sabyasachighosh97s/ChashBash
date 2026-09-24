import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import AppIcon from '@components/AppIcon/AppIcon';
import { Card, Container, Headline, Paragraph } from '@components/ui';
import { CustomStatusBar } from '@components/common/CustomStatusBar';
import { apiGet } from '../../api/client';
import { API_ROUTES } from '../../api/routes';
import colors from '@themes/colors';
import { useAuth } from '../../../src/context/AuthContext';
import CustomHeader from '@components/Header/CustomHeader';
import { CustomToast } from '@components/Toast';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();

  const { t } = useTranslation();
  const {
    user,
    token,
    userType,
    profileCompleted,
    cropCompleted,
    logout,
    updateUser,
  } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [locCropData, setLocCropData] = useState<any>(null);

  const isGuest = userType === 'guest';
  const isOtpUser = userType === 'otp';
  const isRegisteredUser = userType === 'registered';

  /*
  =====================================
  Profile Menu

  Replace Screen Navigation Later
  =====================================
  */
  const getLoginUser = async () => {
    if (!token) {
      return;
    }

    try {
      setLoadingProfile(true);

      // ==========================================
      // GET CURRENT USER
      // ==========================================

      const response = await apiGet(API_ROUTES.GET.USER_ME, token);
      const farmer = response.data;

      // ==========================================
      // GET USER LOCATION / DETAILS
      // ==========================================

      const locCrop = await apiGet(API_ROUTES.GET.USER_BY_ID(farmer.id), token);

      // ==========================================
      // UPDATE AUTH USER
      // ==========================================

      // await updateUser({
      //   id: farmer.id,

      //   name: farmer.name,

      //   phone: farmer.mobile,

      //   email: farmer.email ?? '',

      //   state: locCrop.data?.state_name ?? '',
      //   stateID: locCrop.data?.state_id ?? '',

      //   district: locCrop.data?.district_name ?? '',
      //   districtID: locCrop.data?.district_id ?? '',

      //   block: locCrop.data?.subdivision_name ?? '',
      //   blockID: locCrop.data?.subdivision_id ?? '',

      //   type: farmer.type,

      //   isActive: farmer.is_active,

      //   createdAt: farmer.created_at,

      //   files: farmer.files ?? [],
      // });

      setLocCropData(locCrop.data);
      await updateUser({
        id: farmer.id,

        name: farmer.name,

        phone: farmer.mobile,

        email: farmer.email ?? '',

        state: locCrop.data.state_name,
        stateID: locCrop.data.state_id,
        district: locCrop.data.district_name,
        districtID: locCrop.data.district_id,
        block: locCrop.data.subdivision_name,
        blockID: locCrop.data.subdivision_id,

        type: farmer.type,

        isActive: farmer.is_active,

        createdAt: farmer.created_at,

        files: farmer.files ?? [],
      });
    } catch (error: any) {
      console.log(error?.response?.data);
      console.log(error?.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        getLoginUser();
      }
    }, [token]),
  );
  const profileImage = user?.files?.[0]?.url ?? null;

  const pickProfileImage = () => {
    Alert.alert(
      t('profile_photo'),
      t('choose_an_option'),
      [
        {
          text: t('take_photo'),
          onPress: openCamera,
        },
        {
          text: t('choose_from_gallery'),
          onPress: openGallery,
        },
        {
          text: t('cancel'),
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };
  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) return;

        if (response.errorCode) {
          return;
        }

        const asset = response.assets?.[0];

        if (!asset?.uri) return;

        setSelectedImage(asset.uri);

        // console.log('Gallery Image');
        // console.log(asset);

        // Future
        // uploadProfileImage(asset);
      },
    );
  };
  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        cameraType: 'back',
        saveToPhotos: true,
      },
      response => {
        if (response.didCancel) return;

        if (response.errorCode) {
          return;
        }

        const asset = response.assets?.[0];

        if (!asset?.uri) return;

        setSelectedImage(asset.uri);

        console.log('Camera Image');
        console.log(asset);

        // Future
        // uploadProfileImage(asset);
      },
    );
  };

  const menuList = [
    {
      id: 1,
      title: isRegisteredUser ? t('edit_profile') : t('complete_profile'),
      icon: 'account-edit-outline',
      screen: 'EditProfile',
      show: true,
    },
    {
      id: 2,
      title: t('my_crops'),
      icon: 'sprout',
      screen: 'MyCrops',
      show: isRegisteredUser,
    },
    // {
    //   id: 3,
    //   title: 'Language',
    //   icon: 'translate',
    //   screen: 'Language',
    //   show: true,
    // },
    {
      id: 4,
      title: t('help_support'),
      icon: 'help-circle-outline',
      screen: 'HelpSupport',
      show: true,
    },
    {
      id: 5,
      title: t('about'),
      icon: 'information-outline',
      screen: 'About',
      show: true,
    },
    {
      id: 6,
      title: isRegisteredUser ? t('logout') : t('logout'),
      icon: 'logout',
      screen: 'Logout',
      show: true,
      danger: true,
    },
  ];

  /*
  =====================================
  Menu Click

  Replace with API/Navigation Later
  =====================================
  */

  const onMenuPress = (item: any) => {
    switch (item.screen) {
      case 'EditProfile':
        navigation.navigate('RegistrationScreen', {
          user,
        });

        break;

      case 'MyCrops':
        navigation.navigate('MyCropsScreen', {
          locCropData: locCropData ?? {
            state_id: user?.stateID,
            district_id: user?.districtID,
            subdivision_id: user?.blockID,
          },
        });
        break;

      case 'Language':
        break;

      case 'RegistrationStatus':
        break;

      case 'HelpSupport':
        CustomToast.error(t('Please_Contact_your_admin'));
        break;

      case 'About':
        CustomToast.error(t('Please_Contact_your_admin'));
        break;

      case 'Logout':
        logout();
        break;

      default:
        break;
    }
  };

  return (
    <Container backgroundColor={colors.background}>
      <CustomHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Card style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  resizeMode="cover"
                  style={styles.avatarImage}
                />
              ) : (
                <Headline size="lg" style={styles.avatarInitial}>
                  {isGuest
                    ? t('guest_user').charAt(0).toUpperCase()
                    : (user?.name?.trim()?.charAt(0) || 'U').toUpperCase()}
                </Headline>
              )}
            </View>
          </View>
          <Headline size="lg" style={styles.userName}>
            {isGuest
              ? t('guest_user')
              : isOtpUser
              ? t('complete_profile')
              : user.name}
          </Headline>

          {/* Subtitle */}

          {!isRegisteredUser && (
            <Paragraph style={styles.userSubTitle}>
              {isGuest
                ? t('explore_as_guest')
                : isOtpUser
                ? t('complete_profile_to_unlock')
                : t('registered_farmer')}
            </Paragraph>
          )}

          {/* Status Badge */}

          <View
            style={[
              styles.statusContainer,
              {
                backgroundColor: isGuest
                  ? '#FFF4E5'
                  : isOtpUser
                  ? '#E8F2FF'
                  : '#E8F5E9',
              },
            ]}
          >
            <AppIcon
              type="MaterialCommunityIcons"
              name={
                isGuest
                  ? 'account-outline'
                  : isOtpUser
                  ? 'account-clock-outline'
                  : 'check-circle'
              }
              size={18}
              color={
                isGuest
                  ? colors.warning
                  : isOtpUser
                  ? colors.info
                  : colors.success
              }
            />

            <Paragraph
              style={[
                styles.statusText,
                {
                  color: isGuest
                    ? colors.warning
                    : isOtpUser
                    ? colors.info
                    : colors.success,
                },
              ]}
            >
              {isGuest
                ? t('guest_user')
                : isOtpUser
                ? t('profile_incomplete')
                : t('registered_farmer')}
            </Paragraph>
          </View>

          {/* Divider */}

          <View style={styles.divider} />

          {/* Phone */}

          <View style={styles.infoSection}>
            {/* Phone */}
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <AppIcon
                    type="MaterialCommunityIcons"
                    name="phone-outline"
                    size={18}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.infoContent}>
                  <Paragraph style={styles.infoLabel}>
                    {t('mobile_number')}
                  </Paragraph>

                  <Paragraph style={styles.infoValue} numberOfLines={1}>
                    {isGuest ? t('not_available') : user.phone}
                  </Paragraph>
                </View>
              </View>
            </View>

            {/* Location */}
            <View style={styles.locationColumn}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <AppIcon
                    type="MaterialCommunityIcons"
                    name="map-marker-outline"
                    size={18}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.infoContent}>
                  <Paragraph style={styles.infoLabel}>
                    {t('location')}
                  </Paragraph>

                  <Paragraph style={styles.infoValue}>
  {isRegisteredUser
    ? `${user.block}, ${user.district}`
    : t('location_not_added')}
</Paragraph>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* =====================================
    Menu Card
===================================== */}

        <Card style={styles.menuCard}>
          {menuList
            .filter(item => item.show)
            .map((item, index, array) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => onMenuPress(item)}
                style={[
                  styles.menuItem,
                  index === array.length - 1 && styles.lastMenuItem,
                ]}
              >
                <View style={styles.leftSection}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: item.danger ? '#FDECEC' : '#F3FAED',
                      },
                    ]}
                  >
                    <AppIcon
                      type="MaterialCommunityIcons"
                      name={item.icon}
                      size={22}
                      color={item.danger ? colors.error : colors.primary}
                    />
                  </View>

                  <Paragraph
                    style={[
                      styles.menuText,
                      {
                        color: item.danger ? colors.error : colors.text,
                      },
                    ]}
                  >
                    {item.title}
                  </Paragraph>
                </View>

                <AppIcon
                  type="MaterialCommunityIcons"
                  name="chevron-right"
                  size={24}
                  color={item.danger ? colors.error : colors.subText}
                />
              </TouchableOpacity>
            ))}
        </Card>
      </ScrollView>
    </Container>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    marginTop: 40,
    marginBottom: 16,
    marginHorizontal: 16,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },

  phone: {
    // color: colors.textMuted,
    marginBottom: 14,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    marginLeft: 6,
    // color: colors.textMuted,
    textAlign: 'center',
  },

  menuCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  lastMenuItem: {
    borderBottomWidth: 0,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    // backgroundColor: colors.background,
    backgroundColor: '#F3FAED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'left',
    includeFontPadding: false,
    lineHeight: 24,
  },
  version: {
    textAlign: 'center',
    // color: colors.textMuted,
    marginBottom: 30,
    fontSize: 13,
  },

  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
  },
  infoTextLoc: {
    marginLeft: 8,
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    flexShrink: 1,
  },

  /* =====================================
Profile Card
===================================== */

  profileCard: {
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 10,
    alignItems: 'center',
    // marginBottom: 18,
    marginTop: 10,
  },

  avatarWrapper: {
    width: 68,
    height: 68,
    position: 'relative',
    alignSelf: 'center',
    // marginBottom: 10,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,

    backgroundColor: colors.primary,

    overflow: 'hidden',

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 3,
    borderColor: '#EAF8E8',

    elevation: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 24,
    textAlign: 'center',
  },
  cameraButton: {
    position: 'absolute',

    right: -2,
    bottom: -2,

    width: 30,
    height: 30,
    borderRadius: 15,

    backgroundColor: colors.primary,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 2.5,
    borderColor: '#FFFFFF',

    elevation: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  userName: {
    textAlign: 'center',
    fontWeight: '700',
    color: colors.text,
  },

  userSubTitle: {
    // marginTop: 6,
    marginBottom: 15,
    textAlign: 'center',
    color: colors.subText,
    fontSize: 15,
    // lineHeight: 15,
  },

  /* =====================================
Status Badge
===================================== */

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    alignSelf: 'center',

    paddingHorizontal: 18,
    // paddingVertical: 8,

    borderRadius: 30,

    // marginBottom: 18,
  },

  statusText: {
    marginLeft: 8,
    fontWeight: '700',
    fontSize: 15,
  },

  /* =====================================
Divider
===================================== */

  divider: {
    width: '100%',
    height: 1,

    marginTop: 10,
    marginBottom: 10,

    backgroundColor: colors.border,
  },

  /* =====================================
Information Row
===================================== */
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3FAED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
    marginTop: 0,
  },

  infoContent: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
   
  },

  infoLabel: {
    color: colors.subText,
    fontSize: 12,
    marginBottom: 0,
    textAlign: 'left',
    lineHeight: 15,
  },
  infoValue: {
    flexShrink: 1,
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'left',
    lineHeight: 18,
    includeFontPadding: false,
  },
  infoSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  infoColumn: {
    flex: 1,
  },
locationColumn: {
  flex: 1,
  marginLeft: 5,
},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 40,
  },
});
