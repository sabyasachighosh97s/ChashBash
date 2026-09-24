import Geolocation, {
  GeoPosition,
} from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const requestPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true;
};

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  const hasPermission = await requestPermission();

  if (!hasPermission) {
    return null;
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      error => {
        console.log(error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  });
};