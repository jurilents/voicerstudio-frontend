import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en} from './locales/en';
import {ru} from './locales/ru';

i18n
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('uiLanguage') || 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    defaultNS: 'translation',
    debug: import.meta.env.VITE_DEBUG === 'true',
    resources: {
      en: {translation: en},
      ru: {translation: ru},
    },

    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    console.log('i18n initialized');
  })
  .catch((err) => {
    console.error('i18n initialization failed', err);
  });


export default i18n;
