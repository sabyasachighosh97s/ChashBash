import { PermissionsAndroid, Platform } from 'react-native';

export const requestAppPermissions = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    console.log('Permissions Result =>', result);

    return Object.values(result).every(
      permission =>
        permission === PermissionsAndroid.RESULTS.GRANTED,
    );
  } catch (error) {
    console.log('Permission Error =>', error);
    return false;
  }
};