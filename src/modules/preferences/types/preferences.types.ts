export type Theme = 'light' | 'dark' | 'auto';

export type AppLanguage = 'es' | 'en';

export interface UserPreferences {
  id: string;
  userId: string;
  theme: Theme;
  language: AppLanguage;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserPreferencesParams {
  userId: string;
  theme?: Theme;
  language?: AppLanguage;
  notificationsEnabled?: boolean;
}

export interface UpdateUserPreferencesParams {
  theme?: Theme;
  language?: AppLanguage;
  notificationsEnabled?: boolean;
}
