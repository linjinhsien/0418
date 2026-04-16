import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './en';
import zhTW from './zh-TW';

const i18n = new I18n({ en, 'zh-TW': zhTW });
i18n.locale = getLocales()[0]?.languageTag ?? 'zh-TW';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export function t(key: string): string {
  return i18n.t(key);
}

export function getLocale(): string {
  return i18n.locale;
}

export default i18n;
