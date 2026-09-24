import { checkVersion } from 'react-native-check-version';
import DeviceInfo from 'react-native-device-info';

export const checkForAppUpdate = async () => {
  try {
    const currentVersion = DeviceInfo.getVersion();

    console.log('Current App Version =>', currentVersion);

    const result = await checkVersion({
      platform: 'android',
      bundleId: 'com.chashbash',
      currentVersion,
    });

    console.log('Version Check Result =>', result);

    return {
      needsUpdate: result.needsUpdate ?? false,
      latestVersion: result.version ?? '',
      storeUrl: result.url ?? '',
    };
  } catch (error) {
    console.log('App Version Check Error =>', error);

    return {
      needsUpdate: false,
      latestVersion: '',
      storeUrl: '',
    };
  }
};