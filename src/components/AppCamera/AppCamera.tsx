import React from 'react';

import { Alert } from 'react-native';

import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

type Props = {
  onImageSelected: (image: Asset) => void;
};

const AppCamera = ({ onImageSelected }: Props) => {
  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    });

    const image = result.assets?.[0];

    if (image) {
      onImageSelected(image);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    const image = result.assets?.[0];

    if (image) {
      onImageSelected(image);
    }
  };

  const showPicker = () => {
    Alert.alert(
      'Select Image',
      '',
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
