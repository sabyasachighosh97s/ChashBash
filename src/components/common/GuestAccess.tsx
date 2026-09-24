import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Card, Headline, Paragraph } from '@components/ui';
import AppIcon from '@components/AppIcon/AppIcon';
import useThemeMode from '@hook/useThemeMode';
import { useAuth } from '../../context/AuthContext';

import guestTrainingRice from '@assets/images/paddy2.jpg';
import guestTrainingTomato from '@assets/images/tomato1.jpg';
import guestTrainingPrawn from '@assets/images/chingri1.jpg';

import guestInformationScheme from '@assets/images/govt1.jpg';
import guestInformationExpert from '@assets/images/advisor1.jpg';
import guestInformationWeather from '@assets/images/weather1.jpg';

import guestPopRice from '@assets/images/psddy_icon.png';
import guestPopTomato from '@assets/images/tomato_icon.jpg';
import guestPopTurmeric from '@assets/images/holud_icon.jpg';

/*
|--------------------------------------------------------------------------
| Guest Access Hook
|--------------------------------------------------------------------------
*/

export const useGuestAccess = () => {
  const navigation = useNavigation<any>();
  const { userType } = useAuth();

  const [visible, setVisible] = useState(false);

  const isGuest = userType === 'guest';

  const openGuestAccess = () => {
    setVisible(true);
  };

  const closeGuestAccess = () => {
    setVisible(false);
  };

  const goToRegistration = () => {
    setVisible(false);

   navigation.navigate('MainTabs', {
  screen: 'Profile',
});
  };

  return {
    isGuest,
    visible,
    openGuestAccess,
    closeGuestAccess,
    goToRegistration,
  };
};

export type GuestAccessRequirement = 'registration' | 'registration_and_crop';

/*
|--------------------------------------------------------------------------
| Guest Preview Data
|--------------------------------------------------------------------------
|
| These are NOT real API data.
| They are only used so Guest can understand the UI.
|--------------------------------------------------------------------------
*/

export const getGuestPreviewData = (
  type: 'training' | 'information' | 'pop',
) => {
  switch (type) {
    case 'training':
      return [
        {
          id: 'guest-training-1',
          title: 'উন্নত পদ্ধতিতে লাভজনক ধান চাষ',
          description: 'নমুনা প্রশিক্ষণ',
          image: guestTrainingRice,
          isGuestPreview: true,
        },
        {
          id: 'guest-training-2',
          title: 'আধুনিক টমেটো চাষ ও সঠিক পরিচর্যা',
          description: 'নমুনা প্রশিক্ষণ',
          image: guestTrainingTomato,
          isGuestPreview: true,
        },
        {
          id: 'guest-training-3',
          title: 'উন্নত পদ্ধতিতে লাভজনক লবস্টার / গলদা চিংড়ি চাষ',
          description: 'নমুনা প্রশিক্ষণ',
          image: guestTrainingPrawn,
          isGuestPreview: true,
        },
      ];

    case 'information':
      return [
        {
          id: 'guest-information-1',
          title: 'সরকারি প্রকল্প ও ভর্তুকি',
          description: 'নমুনা তথ্য',
          image: guestInformationScheme,
          isGuestPreview: true,
        },
        {
          id: 'guest-information-2',
          title: 'কৃষি বিশেষজ্ঞের পরামর্শ',
          description: 'নমুনা তথ্য',
          image: guestInformationExpert,
          isGuestPreview: true,
        },
        {
          id: 'guest-information-3',
          title: 'আজকের আবহাওয়ার পূর্বাভাস',
          description: 'নমুনা তথ্য',
          image: guestInformationWeather,
          isGuestPreview: true,
        },
      ];

    case 'pop':
      return [
        {
          id: 'guest-pop-1',
          crop_name: {
            name: 'ধান',
          },
          image: guestPopRice,
          isGuestPreview: true,
        },
        {
          id: 'guest-pop-2',
          crop_name: {
            name: 'টমেটো',
          },
          image: guestPopTomato,
          isGuestPreview: true,
        },
        {
          id: 'guest-pop-3',
          crop_name: {
            name: 'হলুদ',
          },
          image: guestPopTurmeric,
          isGuestPreview: true,
        },
      ];

    default:
      return [];
  }
};

/*
|--------------------------------------------------------------------------
| Guest Access Modal
|--------------------------------------------------------------------------
*/

type GuestAccessModalProps = {
  visible: boolean;
  onClose: () => void;
  onRegister: () => void;
  requirement?: GuestAccessRequirement;
};

export const GuestAccessModal = ({
  visible,
  onClose,
  onRegister,
  requirement = 'registration',
}: GuestAccessModalProps) => {
  const { theme } = useThemeMode();
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Card
          style={[
            styles.modalCard,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <View style={styles.accessHeader}>
            {/* Icon */}
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: '#FFF1F1',
                },
              ]}
            >
              <AppIcon
                type="MaterialCommunityIcons"
                name="account-lock-outline"
                size={35}
                color={theme.colors.error}
              />
            </View>

            {/* Title + Requirement */}
            <View style={styles.accessTextContainer}>
              <Headline
                size="xl"
                style={[
                  styles.title,
                  {
                    color: theme.colors.error,
                  },
                ]}
              >
                {t('guest_access_title')}
              </Headline>
            </View>
          </View>

          <Paragraph
            size="sm"
            style={[
              styles.message,
              {
                color: theme.colors.subText,
              },
            ]}
          >
            {requirement === 'registration_and_crop'
              ? t('guest_registration_and_crop_message')
              : t('guest_registration_message')}
          </Paragraph>

          <View style={styles.noteBox}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="information-outline"
              size={18}
              color={theme.colors.primary}
            />

            <Paragraph
              size="xs"
              style={[
                styles.noteText,
                {
                  color: theme.colors.subText,
                },
              ]}
            >
              {t('guest_preview_note')}
            </Paragraph>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={[
                styles.laterButton,
                {
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Paragraph
                size="sm"
                style={{
                  color: theme.colors.text,
                  fontWeight: '700',
                }}
              >
                {t('later')}
              </Paragraph>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onRegister}
              style={[
                styles.registerButton,
                {
                  backgroundColor: theme.colors.primary,
                },
              ]}
            >
              <Paragraph size="sm" style={styles.registerButtonText}>
                {t('register_now')}
              </Paragraph>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  modalCard: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
    borderRadius: 26,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  iconCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  accessHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  accessTextContainer: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },

  title: {
    textAlign: 'left',
    fontWeight: '800',
    lineHeight: 28,
  },

  requiredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  message: {
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  requiredDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  requiredText: {
    flex: 1,
    fontWeight: '700',
    lineHeight: 18,
  },
  noteBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },

  noteText: {
    flex: 1,
    marginLeft: 8,
    lineHeight: 18,
  },

  buttons: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },

  laterButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
});

export default GuestAccessModal;
