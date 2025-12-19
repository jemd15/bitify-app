import { AppLanguage } from '@locale/languages';

import {
  THEME_VALUE_LIGHT,
  THEME_VALUE_DARK,
  THEME_VALUE_AUTO,
} from '../constants/account.constants';

export interface AccountScreenProps {}

export interface ProfileScreenProps {}

export type UserType = 'free' | 'pro';

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProfileParams {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  userType?: UserType;
}

export interface UpdateProfileParams {
  fullName?: string;
  avatarUrl?: string;
  userType?: UserType;
}

export type Theme =
  | typeof THEME_VALUE_LIGHT
  | typeof THEME_VALUE_DARK
  | typeof THEME_VALUE_AUTO;

export interface UserPreferences {
  id: string;
  userId: string;
  theme: Theme;
  language: AppLanguage;
  notificationsEnabled: boolean;
  notificationsTaskReminderEnabled: boolean;
  notificationsTaskValidationEnabled: boolean;
  notificationsMemberJoinedEnabled: boolean;
  notificationsMemberLeftEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserPreferencesParams {
  theme?: Theme;
  language?: AppLanguage;
  notificationsEnabled?: boolean;
  notificationsTaskReminderEnabled?: boolean;
  notificationsTaskValidationEnabled?: boolean;
  notificationsMemberJoinedEnabled?: boolean;
  notificationsMemberLeftEnabled?: boolean;
}
