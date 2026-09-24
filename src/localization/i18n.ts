import i18n from 'i18next';

import {
  initReactI18next,
} from 'react-i18next';

import en from './en.json';
import bn from './bn.json';

i18n
  .use(initReactI18next)

  .init({
    compatibilityJSON: 'v4',

    lng: 'bn',

    fallbackLng: 'en',

    resources: {
      en: {
        translation: en,
      },

      bn: {
        translation: bn,
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;