import { msg } from '@lingui/macro';

export const ACCOUNT_CONSTANTS = {
  PROFILE_TITLE: msg`My Account`,
  PROFILE_USER_PLACEHOLDER: msg`User Name`,
  MENU_ITEM_PLAN_PRO_TITLE: msg`Pro Plan`,
  MENU_ITEM_PLAN_PRO_DESCRIPTION: msg`Your Pro investment account in the USA`,
  MENU_ITEM_INVESTMENTS_TITLE: msg`Investments`,
  MENU_ITEM_INVESTMENTS_DESCRIPTION: msg`Deposits, features and documents`,
  MENU_ITEM_PREFERENCES_TITLE: msg`Preferences`,
  MENU_ITEM_PREFERENCES_DESCRIPTION: msg`Dark mode, Face ID and keep session`,
  MENU_ITEM_LOGOUT_TITLE: msg`Logout`,
  SETTINGS_TITLE: msg`Settings`,
  AUTH_TITLE: msg`Authentication`,
} as const;
