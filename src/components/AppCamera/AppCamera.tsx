import React from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

type Props = {
  onImageSelected: (image: Asset) => void;
};

const AppCamera = ({ onImageSelected }: Props) => {
  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'ChashBash needs access to your camera.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log('Permission Error:', error);
      return false;
    }
  };

  const openCamera = async () => {
    try {
      console.log('Camera button pressed');

      const hasPermission = await requestCameraPermission();

      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos.',
        );
        return;
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 1,
        saveToPhotos: true,
      });

      console.log('Camera Result =>', JSON.stringify(result, null, 2));

      if (result.didCancel) {
        console.log('User cancelled camera');
        return;
      }

      if (result.errorCode) {
        console.log('Camera Error Code:', result.errorCode);
        console.log('Camera Error Message:', result.errorMessage);

        Alert.alert('Camera Error', result.errorMessage || result.errorCode);

        return;
      }

      const image = result.assets?.[0];

      if (image) {
        onImageSelected(image);
      }
    } catch (error) {
      console.log('Camera Exception =>', error);
      Alert.alert('Error', 'Unable to open camera');
    }
  };

  const openGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      console.log('Gallery Result =>', JSON.stringify(result, null, 2));

      const image = result.assets?.[0];

      if (image) {
        onImageSelected(image);
      }
    } catch (error) {
      console.log('Gallery Exception =>', error);
    }
  };

  const showPicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: openCamera,
        },
        {
          text: 'Gallery',
          onPress: openGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return {
    showPicker,
  } as any;
};

export default AppCamera;
