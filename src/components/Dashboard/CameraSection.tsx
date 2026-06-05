import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import AppIcon from '@components/AppIcon/AppIcon';
import AppCamera from '@components/AppCamera/AppCamera';
import LeafHelpModal from '@components/AppCamera/LeafHelpModal';

import { Card, Headline, Paragraph } from '@components/ui';

type Props = {
  data: {
    title: string;
    description: string;
    buttonText: string;
  };
};

const CameraSection = ({ data }: Props) => {
  const [showHelp, setShowHelp] = useState(false);

  const navigation = useNavigation<any>();

  const camera = AppCamera({
    onImageSelected: async image => {
      try {
        /**
         * TODO:
         * Replace this dummy response with your API response
         */

        const diseaseResult = {
          name: 'Leaf Blight',
          severity: 'Medium',
          description: 'Leaf blight is a fungal disease affecting crop leaves.',
          treatment:
            'Apply fungicide and remove infected leaves to prevent further spread.',
        };

        navigation.navigate('DiseaseResult', {
          image,
          disease: diseaseResult,
        });
      } catch (error) {
        console.log('Disease Detection Error:', error);
      }
    },
  });

  return (
    <>
      <Headline>{data.title}</Headline>

      <Paragraph
        size="base"
        style={{
          textAlign: 'left',
        }}
      >
        {data.description}
      </Paragraph>

      <TouchableOpacity
        onPress={() => setShowHelp(true)}
        style={{
          marginTop: 10,
          marginBottom: 12,
        }}
      >
        <Paragraph
          style={{
            color: '#1565C0',
            fontWeight: '700',
          }}
        >
          📷 ছবি তোলার নির্দেশনা
        </Paragraph>
      </TouchableOpacity>

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
              এইভাবে ছবি তুলুন
            </Paragraph>

            <Paragraph
              size="xs"
              style={{
                textAlign: 'center',
              }}
            >
              ভালো আলোতে পাতাটি পরিষ্কারভাবে ধরুন
            </Paragraph>
          </Card>

          {/* Static Preview Box */}
          <View style={styles.previewBox}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="camera-plus-outline"
              size={52}
              color="#1565C0"
            />

            <Text style={styles.previewText}>আক্রান্ত অংশের ছবি তুলুন</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.openCameraButton}
          onPress={camera.showPicker}
        >
          <Paragraph style={styles.openCameraButtonText}>
            {data.buttonText}
          </Paragraph>
        </TouchableOpacity>
      </Card>

      <LeafHelpModal visible={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
};

export default CameraSection;

const styles = StyleSheet.create({
  cameraTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 12,
  },

  cameraPreviewCard: {
    flex: 1,
    backgroundColor: '#F4F7F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  liveCameraImage: {
    width: 120,
    height: 100,
  },

  previewBox: {
    flex: 1,
    height: 180,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },

  previewText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  openCameraButton: {
    marginTop: 24,
    width: '100%',
    backgroundColor: '#1565C0',
    paddingVertical: 16,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  openCameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
