import { initReactI18next } from 'react-i18next';
import i18n, { Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';

const resources: Resource = {
  en: { translation: en },
  es: { translation: es },
};

// All options: https://www.i18next.com/overview/configuration-options

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    resources,
    react: { useSuspense: true },
  });

export default i18n;
