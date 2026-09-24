import { CustomToast } from '@components/Toast';
import { createNavigationContainerRef } from '@react-navigation/native';
import i18n from 'i18next';

export const navigationRef =
  createNavigationContainerRef<any>();

export const navigate = (
  route: string,
  params?: any,
) => {
  if (!navigationRef.isReady()) {
    return;
  }

  // Features that are not available yet
  const unavailableRoutes = [
    'Government',
    // 'InputOutput'
  ];

  if (unavailableRoutes.includes(route)) {
    CustomToast.error(
      i18n.t('Please_Contact_your_admin'),
    );
    return;
  }

  navigationRef.navigate(route, params);
};