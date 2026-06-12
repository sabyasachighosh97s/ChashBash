import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Card, Headline, Paragraph } from '@components/ui';
import { useNavigation } from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  usePhotoOutput,
  type CameraRef,
} from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import AppIcon from '@components/AppIcon/AppIcon';
import LeafHelpModal from '@components/AppCamera/LeafHelpModal';
import colors from '@themes/colors';

export default function VisionCameraScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [showHelp, setShowHelp] = useState(false);
  const [showIntroText, setShowIntroText] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const device = useCameraDevice('back');
  const camera = useRef<CameraRef>(null);
  const photoOutput = usePhotoOutput();
  const frameWidth = useRef(new Animated.Value(260)).current;
  const frameHeight = useRef(new Animated.Value(320)).current;
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroText(false);

      Animated.parallel([
        Animated.timing(frameWidth, {
          toValue: 340,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(frameHeight, {
          toValue: 520,
          duration: 700,
          useNativeDriver: false,
        }),
      ]).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const diseaseResult = {
    name: 'Leaf Blight',
    severity: 'Medium',
    description: 'Leaf blight is a fungal disease affecting crop leaves.',
    treatment:
      'Apply fungicide and remove infected leaves to prevent further spread.',
  };

  const capturePhoto = async () => {
    try {
      const photoFile = await photoOutput.capturePhotoToFile(
        {
          flashMode: flashEnabled ? 'on' : 'off',
        },
        {},
      );

      const imageUri = `file://${photoFile.filePath}`;

      setCapturedImage(imageUri);
    } catch (error) {
      console.log('Capture Error:', error);
    }
  };
  const confirmImage = () => {
    if (!capturedImage) {
      return;
    }

    navigation.navigate('DiseaseResult', {
      image: {
        uri: capturedImage,
      },
      disease: diseaseResult,
    });
  };
  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
    }
  };
  const openGallery = async () => {
    await requestGalleryPermission();

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      const image = result.assets?.[0];

      if (!image) {
        return;
      }

      navigation.navigate('DiseaseResult', {
        image,
        disease: diseaseResult,
      });
    } catch (error) {
      console.log('Gallery Error:', error);
    }
  };

  if (!device) {
    return (
      <View style={styles.loader}>
        <Card style={styles.loadingCard}>
          <Headline size="md"> {t('camera_starting')}</Headline>

          <Paragraph size="sm" style={{ marginTop: 4 }}>
            {t('please_wait')}
          </Paragraph>
        </Card>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {capturedImage ? (
        <Image
          source={{ uri: capturedImage }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          outputs={[photoOutput]}
          isActive={true}
        />
      )}
      <View style={styles.overlay} />

      {/* Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AppIcon
          type="MaterialCommunityIcons"
          name="arrow-left"
          size={30}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Flash */}
      <TouchableOpacity
        style={styles.flashButton}
        onPress={() => setFlashEnabled(prev => !prev)}
      >
        <AppIcon
          type="MaterialCommunityIcons"
          name={flashEnabled ? 'flash' : 'flash-off'}
          size={28}
          color={flashEnabled ? colors.accent : colors.textLight}
        />
      </TouchableOpacity>

      {/* Scanner Frame */}
      {!capturedImage && (
        <View style={styles.frameContainer}>
          <Animated.View
            style={[
              styles.frame,
              {
                width: frameWidth,
                height: frameHeight,
              },
            ]}
          >
            <View style={styles.focusOverlay} />
            {showIntroText && (
              <View style={styles.scanInstruction}>
                <Headline size="md" style={styles.scanTitle}>
                  {t('capture_crop_photo')}
                </Headline>

                <Paragraph size="sm" style={styles.scanSubtitle}>
                  {t('capture_crop_subtitle')}
                </Paragraph>
              </View>
            )}

            <View style={styles.topLeft} />
            <View style={styles.topRight} />
            <View style={styles.bottomLeft} />
            <View style={styles.bottomRight} />
          </Animated.View>
        </View>
      )}
      {capturedImage && (
        <Card style={styles.resultCard}>
          <Headline size="sm" style={styles.resultTitle}>
            {t('image_ready')}
          </Headline>

          <Paragraph size="xs" style={styles.resultText}>
            {t('start_analysis')}
          </Paragraph>
        </Card>
      )}
      {capturedImage && (
        <View style={styles.previewActions}>
          <TouchableOpacity
            style={styles.actionCircle}
            onPress={() => setCapturedImage(null)}
          >
            <AppIcon
              type="MaterialCommunityIcons"
              name="camera-retake"
              size={34}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.confirmCircle} onPress={confirmImage}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="check"
              size={38}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Controls */}
      {!capturedImage && (
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.sideButton} onPress={openGallery}>
            <AppIcon
              type="MaterialCommunityIcons"
              name="image-outline"
              size={28}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={capturePhoto}
          />

          <TouchableOpacity
            style={styles.sideButton}
            onPress={() => setShowHelp(true)}
          >
            <AppIcon
              type="MaterialCommunityIcons"
              name="help-circle-outline"
              size={34}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      )}

      <LeafHelpModal visible={showHelp} onClose={() => setShowHelp(false)} />
    </View>
  );
}

const CORNER_SIZE = 55;
const BORDER_WIDTH = 5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.heroOverlay,
  },

  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.glassMedium,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },

  flashButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.glassMedium,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },

  frameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  frame: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  topLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderColor: colors.accent,
    borderTopLeftRadius: 25,
  },

  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderColor: colors.accent,
    borderTopRightRadius: 25,
  },

  bottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderColor: colors.accent,
    borderBottomLeftRadius: 25,
  },

  bottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderColor: colors.accent,
    borderBottomRightRadius: 25,
  },

  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 35,
  },

  sideButton: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.glassMedium,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureButton: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.surface,
    borderWidth: 6,
    borderColor: colors.accent,
  },
  previewActions: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
  },

  confirmCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 20,
  },

  scanInstruction: {
    backgroundColor: colors.cardOverlay,
    borderWidth: 1,
    borderColor: colors.glassBorderActive,
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    maxWidth: '85%',
  },

  scanTitle: {
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 6,
  },

  scanSubtitle: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  resultCard: {
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  resultTitle: {
    textAlign: 'center',
    color: colors.primary,
  },

  resultText: {
    textAlign: 'center',
    color: colors.subText,
  },
  focusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.cardOverlay,
    borderRadius: 24,
  },
});
