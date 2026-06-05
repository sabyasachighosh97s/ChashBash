import React from 'react';

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from 'react-native-paper';

import Paragraph from '@components/common/Paragraph';
import Headline from '@components/common/Headline';

const CameraPreviewCard = () => {
  const theme = useTheme<any>();

  const isDark = theme.dark;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* LEFT */}

        <View
          style={[
            styles.cameraPreviewCard,

            {
              backgroundColor: isDark ? '#14211B' : '#F4F7F1',

              borderColor: isDark ? '#294236' : 'transparent',
            },
          ]}
        >
          <Image
            source={require('../../assets/images/leaf_scan.png')}
            style={styles.liveCameraImage}
            resizeMode="contain"
          />

          <Headline
            style={[
              styles.cameraMainTitle,

              {
                color: isDark ? '#D1D5DB' : '#334155',
              },
            ]}
          >
            এইভাবে ছবি তুলুন
          </Headline>
          <Paragraph
            style={[
              styles.cameraInstruction,

              {
                color: isDark ? '#D1D5DB' : '#334155',
              },
            ]}
          >
            ভালো আলোতে পাতাটি পরিষ্কারভাবে ধরুন
          </Paragraph>
        </View>

        {/* RIGHT */}

        <View
          style={[
            styles.previewBox,

            {
              backgroundColor: isDark ? '#101A2B' : '#F8FAFC',

              borderColor: isDark ? '#243244' : '#CBD5E1',
            },
          ]}
        >
          <Text style={styles.previewIcon}>📷</Text>

          <Paragraph
            style={[
              styles.previewText,

              {
                color: isDark ? '#E2E8F0' : '#475569',
              },
            ]}
          >
            আক্রান্ত অংশের ছবি তুলুন
          </Paragraph>
        </View>
      </View>

      {/* BUTTON */}

      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.openCameraButton,

          {
            backgroundColor: isDark ? '#2563EB' : '#1565C0',
          },
        ]}
      >
        <Text style={styles.openCameraButtonText}>ক্যামেরা খুলুন</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraPreviewCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 18,

    alignItems: 'center',
  },

  topRow: {
    width: '100%',

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'stretch',

    gap: 12,
  },

  cameraPreviewCard: {
    flex: 1,

    borderRadius: 24,

    borderWidth: 1,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 10,
  },

  liveCameraImage: {
    width: 120,

    height: 100,
  },
  cameraMainTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    // marginBottom: 5,
    textAlign: 'center',
  },
  cameraInstruction: {
    fontSize: 10,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },

  previewBox: {
    flex: 1,
    height: 160,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  previewIcon: {
    fontSize: 48,
  },

  previewText: {
    // marginTop: 10,

    fontSize: 12,

    fontWeight: '600',

    textAlign: 'center',

    paddingHorizontal: 4,
  },

  openCameraButton: {
    marginTop: 24,

    width: '100%',

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
