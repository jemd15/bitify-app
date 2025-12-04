import { useEffect } from 'react';
import { useStorage } from '@shared/storage';
import { device } from '@shared/storage';
import { AppLanguage } from '@locale/languages';
import { getDeviceLanguage } from '@locale/deviceLocales';
import { dynamicActivate } from '@locale/i18n';

export const useLanguagePrefs = () => {
  const [appLanguage, setAppLanguage] = useStorage(device, ['appLanguage']);

  const currentLanguage = appLanguage || getDeviceLanguage();

  useEffect(() => {
    dynamicActivate(currentLanguage as AppLanguage);
  }, [currentLanguage]);

  const changeLanguage = (language: AppLanguage) => {
    setAppLanguage(language);
  };

  return {
    appLanguage: currentLanguage,
    changeLanguage,
  };
};
