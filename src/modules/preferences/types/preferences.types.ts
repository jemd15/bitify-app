export type Theme = 'light' | 'dark' | 'auto';

export type AppLanguage = 'es' | 'en';

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

export interface CreateUserPreferencesParams {
  userId: string;
  theme?: Theme;
  language?: AppLanguage;
  notificationsEnabled?: boolean;
  notificationsTaskReminderEnabled?: boolean;
  notificationsTaskValidationEnabled?: boolean;
  notificationsMemberJoinedEnabled?: boolean;
  notificationsMemberLeftEnabled?: boolean;
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
