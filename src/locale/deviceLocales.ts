import * as Localization from 'expo-localization';

import { AppLanguage } from './languages';

export function getDeviceLocales(): string[] {
  return Localization.getLocales().map(locale => locale.languageCode || 'en');
}

export function getDeviceLanguage(): AppLanguage {
  const locales = getDeviceLocales();
  const firstLocale = locales[0] || 'en';

  if (firstLocale.startsWith('es')) {
    return AppLanguage.ES;
  }
  if (firstLocale.startsWith('en')) {
    return AppLanguage.EN;
  }

  return AppLanguage.EN;
}
