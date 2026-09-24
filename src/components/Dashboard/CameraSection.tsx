import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import AppIcon from '@components/AppIcon/AppIcon';
// import AppCamera from '@components/AppCamera/AppCamera';
import LeafHelpModal from '@components/AppCamera/LeafHelpModal';
import colors from '@themes/colors';
import { Card, Headline, Paragraph } from '@components/ui';
import { Rbutton } from '@components/common/Rbutton';
import { useTranslation } from 'react-i18next';
import GuestAccessModal, {
  useGuestAccess,
} from '@components/common/GuestAccess';

type Props = {
  data: {
    title: string;
    description: string;
    buttonText: string;
  };
};

const CameraSection = ({ data }: Props) => {
  const {
    isGuest,
    visible,
    openGuestAccess,
    closeGuestAccess,
    goToRegistration,
  } = useGuestAccess();

  const { cropCompleted } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  // const camera = AppCamera({
  //   onImageSelected: async image => {
  //     try {
  //       /**
  //        * TODO:
  //        * Replace this dummy response with your API response
  //        */

  //       const diseaseResult = {
  //         name: 'Leaf Blight',
  //         severity: 'Medium',
  //         description: 'Leaf blight is a fungal disease affecting crop leaves.',
  //         treatment:
  //           'Apply fungicide and remove infected leaves to prevent further spread.',
  //       };

  //       navigation.navigate('DiseaseResult', {
  //         image,
  //         disease: diseaseResult,
  //       });
  //     } catch (error) {
  //       console.log('Disease Detection Error:', error);
  //     }
  //   },
  // });

  return (
    <>
      <View style={styles.headerRow}>
        <Headline>{data.title}</Headline>
      </View>

      <Card variant="contained">
        <View style={styles.cameraTopRow}>
          <Card style={styles.cameraPreviewCard}>
            <Image
              source={require('../../assets/images/leaf_scan.png')}
              style={styles.liveCameraImage}
              resizeMode="contain"
            />

            <Paragraph
              size="sm"
              style={{
                textAlign: 'center',
                fontWeight: '700',
              }}
            >
              {t('take_photo_example')}
            </Paragraph>

            <Paragraph
              size="xs"
              lineHeight={15}
              style={{
                textAlign: 'center',
              }}
            >
              {t('good_light_tip')}
            </Paragraph>
          </Card>

          {/* Static Preview Box */}
        </View>

        <Rbutton
          title={data.buttonText}
          buttonColor="#1565C0"
          onPress={() => {
            if (isGuest) {
              openGuestAccess();
              return;
            }

            if (!cropCompleted) {
              openGuestAccess();
              return;
            }

            navigation.navigate('VisionCamera');
          }}
          style={{
            marginTop: 10,
            borderRadius: 18,
          }}
        />

        <Rbutton
          title={t('see_old_problems')}
          buttonColor="#1565C0"
          onPress={() => {
            if (isGuest) {
              openGuestAccess();
              return;
            }

            if (!cropCompleted) {
              openGuestAccess();
              return;
            }

            navigation.navigate('ProblemHistoryScreen');
          }}
          style={{
            marginTop: 10,
            borderRadius: 18,
          }}
        />
      </Card>
      <GuestAccessModal
        visible={visible}
        onClose={closeGuestAccess}
        onRegister={goToRegistration}
        requirement="registration_and_crop"
      />
    </>
  );
};

export default CameraSection;

const styles = StyleSheet.create({
  cameraTopRow: {
    width: '100%',
  },

  cameraPreviewCard: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  liveCameraImage: {
    width: 250,
    height: 100,
    alignSelf: 'center',
  },

  openCameraButton: {
    marginTop: 24,
    width: '100%',
    backgroundColor: colors.info,
    paddingVertical: 16,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  openCameraButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '800',
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  guideText: {
    color: colors.info,
    fontWeight: '700',
    marginLeft: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
