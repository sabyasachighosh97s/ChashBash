// CustomToast.ts

import {
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';

type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

type ToastPosition =
  | 'top'
  | 'center'
  | 'bottom';

const getGravity = (
  position: ToastPosition,
) => {
  switch (position) {
    case 'top':
      return ToastAndroid.TOP;

    case 'center':
      return ToastAndroid.CENTER;

    case 'bottom':
    default:
      return ToastAndroid.BOTTOM;
  }
};

const show = (
  message: string,

  duration:
    | 'short'
    | 'long' = 'short',

  position: ToastPosition =
    'bottom',
) => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(
      message,

      duration === 'long'
        ? ToastAndroid.LONG
        : ToastAndroid.SHORT,

      getGravity(position),
    );
  } else {
    Alert.alert(message);
  }
};

export const CustomToast = {
  success: (
    message: string,

    duration:
      | 'short'
      | 'long' = 'short',
  ) => {
    show(
      `✅ ${message}`,

      duration,
    );
  },

  error: (
    message: string,

    duration:
      | 'short'
      | 'long' = 'short',
  ) => {
    show(
      `❌ ${message}`,

      duration,
    );
  },

  warning: (
    message: string,

    duration:
      | 'short'
      | 'long' = 'short',
  ) => {
    show(
      `⚠️ ${message}`,

      duration,
    );
  },

  info: (
    message: string,

    duration:
      | 'short'
      | 'long' = 'short',
  ) => {
    show(
      `ℹ️ ${message}`,

      duration,
    );
  },
};