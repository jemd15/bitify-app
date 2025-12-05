import React, { useEffect } from 'react';
import { I18nProvider as LinguiI18nProvider } from '@lingui/react';
import { useLanguagePrefs } from '@shared/hooks/useLanguagePrefs';
import { i18n } from '@lingui/core';

import { dynamicActivate } from './i18n';
import { AppLanguage } from './languages';

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const { appLanguage } = useLanguagePrefs();

  useEffect(() => {
    dynamicActivate(appLanguage as AppLanguage);
  }, [appLanguage]);

  return <LinguiI18nProvider i18n={i18n}>{children}</LinguiI18nProvider>;
};
