import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import zhTW from './zh-TW';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'zh-TW': { translation: zhTW },
    },
    lng: typeof window !== 'undefined' ? window.navigator.language : 'zh-TW',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export function t(key: string): string {
  return i18n.t(key);
}

export function getLocale(): string {
  return i18n.language;
}

export default i18n;
