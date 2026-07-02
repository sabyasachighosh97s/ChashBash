import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import AppIcon from '@components/AppIcon/AppIcon';
import { Card, Container, Headline, Paragraph } from '@components/ui';
import { CustomStatusBar } from '@components/common/CustomStatusBar';

import colors from '@themes/colors';
import { useAuth } from '../../../src/context/AuthContext';
const ProfileScreen = () => {
  const navigation = useNavigation<any>();

  const { t } = useTranslation();
  const { user, userType, profileCompleted, cropCompleted, logout } = useAuth();

  /*
  =====================================
  Dummy User Data

  Replace with API Later
  =====================================
  */

  const isGuest = userType === 'guest';

  const isOtpUser = userType === 'otp';

  const isRegisteredUser = userType === 'registered';

  /*
  =====================================
  Profile Menu

  Replace Screen Navigation Later
  =====================================
  */

  const menuList = [
    {
      id: 1,
      title: isRegisteredUser ? 'Edit Profile' : 'Complete Profile',
      icon: 'account-edit-outline',
      screen: 'EditProfile',
      show: true,
    },
    {
      id: 2,
      title: 'My Crops',
      icon: 'sprout',
      screen: 'MyCrops',
      show: isRegisteredUser,
    },
    {
      id: 3,
      title: 'Language',
      icon: 'translate',
      screen: 'Language',
      show: true,
    },
    {
      id: 4,
      title: 'Help & Support',
      icon: 'help-circle-outline',
      screen: 'HelpSupport',
      show: true,
    },
    {
      id: 5,
      title: 'About',
      icon: 'information-outline',
      screen: 'About',
      show: true,
    },
    {
      id: 6,
      title: 'Logout',
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

  const onMenuPress = async (item: any) => {
    switch (item.screen) {
      case 'EditProfile':
        navigation.navigate('RegistrationScreen');
        break;

      case 'MyCrops':
        console.log('Navigate My Crops');
        break;

      case 'Language':
        console.log('Navigate Language');
        break;

      case 'RegistrationStatus':
        console.log('Navigate Registration Status');
        break;

      case 'HelpSupport':
        console.log('Navigate Help');
        break;

      case 'About':
        console.log('Navigate About');
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
      <CustomStatusBar />

      <Headline size="xl" style={styles.title}>
        {t('profile')}
      </Headline>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* =====================================
    Profile Card
===================================== */}

        {/* =====================================
    Profile Card
===================================== */}

        <Card style={styles.profileCard}>
          {/* Avatar */}

          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="account"
                size={50}
                color={colors.background}
              />
            </View>
          </View>

          {/* Name */}

          <Headline size="lg" style={styles.userName}>
            {isGuest
              ? 'Guest User'
              : isOtpUser
              ? 'Complete Your Profile'
              : user.name}
          </Headline>

          {/* Subtitle */}

          <Paragraph style={styles.userSubTitle}>
            {isGuest
              ? 'Explore ChashBash as a guest'
              : isOtpUser
              ? 'Complete your profile to unlock all features'
              : 'Registered Farmer'}
          </Paragraph>

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
                ? 'Guest User'
                : isOtpUser
                ? 'Profile Incomplete'
                : 'Registered Farmer'}
            </Paragraph>
          </View>

          {/* Divider */}

          <View style={styles.divider} />

          {/* Phone */}

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="phone-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <View style={styles.infoContent}>
              <Paragraph style={styles.infoLabel}>Mobile Number</Paragraph>

              <Paragraph style={styles.infoValue}>
                {isGuest ? 'Not Available' : user.phone}
              </Paragraph>
            </View>
          </View>

          {/* Location */}

          <View style={[styles.infoRow, { marginBottom: 0 }]}>
            <View style={styles.infoIcon}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="map-marker-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <View style={styles.infoContent}>
              <Paragraph style={styles.infoLabel}>Location</Paragraph>

              <Paragraph style={styles.infoValue}>
                {isRegisteredUser
                  ? `${user.block}, ${user.district}, ${user.state}`
                  : 'Location Not Added'}
              </Paragraph>
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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
  },

  avatarWrapper: {
    marginBottom: 10,
    alignItems: 'center',
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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

  infoRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3FAED',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 14,
  },

  infoContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  infoLabel: {
    color: colors.subText,
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'left',
  },

  infoValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'left',
  },
});
