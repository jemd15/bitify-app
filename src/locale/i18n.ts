import { i18n } from '@lingui/core';

import { AppLanguage } from './languages';
import { messages as messagesEs } from './locales/es/messages';
import { messages as messagesEn } from './locales/en/messages';

export async function dynamicActivate(locale: AppLanguage): Promise<void> {
  switch (locale) {
    case AppLanguage.ES: {
      i18n.loadAndActivate({ locale: 'es', messages: messagesEs });
      break;
    }
    case AppLanguage.EN: {
      i18n.loadAndActivate({ locale: 'en', messages: messagesEn });
      break;
    }
    default: {
      i18n.loadAndActivate({ locale: 'es', messages: messagesEs });
    }
  }
}
