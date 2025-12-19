import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@lib/supabase';
import { useAuthSession } from '@modules/auth/hooks/useAuthSession';
import { device } from '@shared/storage';
import { AppLanguage } from '@locale/languages';
import { dynamicActivate } from '@locale/i18n';

import {
  THEME_VALUE_AUTO,
  LANGUAGE_VALUE_ES,
  DB_TABLE_USER_PREFERENCES,
  DB_FIELD_USER_ID,
  DB_FIELD_THEME,
  DB_FIELD_LANGUAGE,
  DB_FIELD_NOTIFICATIONS_ENABLED,
  DB_FIELD_NOTIFICATIONS_TASK_REMINDER_ENABLED,
  DB_FIELD_NOTIFICATIONS_TASK_VALIDATION_ENABLED,
  DB_FIELD_NOTIFICATIONS_MEMBER_JOINED_ENABLED,
  DB_FIELD_NOTIFICATIONS_MEMBER_LEFT_ENABLED,
  STORAGE_KEY_PREFERENCES,
  STORAGE_KEY_APP_LANGUAGE,
  DEFAULT_NOTIFICATIONS_ENABLED,
} from '../constants/account.constants';
import type { UserPreferences, Theme } from '../types/account.types';

export const RQKEY_PREFERENCES = ['account', 'preferences'] as const;

const mapUserPreferencesFromDb = (data: any): UserPreferences => {
  return {
    id: data.id,
    userId: data[DB_FIELD_USER_ID],
    theme: (data[DB_FIELD_THEME] || THEME_VALUE_AUTO) as Theme,
    language: (data[DB_FIELD_LANGUAGE] || LANGUAGE_VALUE_ES) as AppLanguage,
    notificationsEnabled:
      data[DB_FIELD_NOTIFICATIONS_ENABLED] ?? DEFAULT_NOTIFICATIONS_ENABLED,
    notificationsTaskReminderEnabled:
      data[DB_FIELD_NOTIFICATIONS_TASK_REMINDER_ENABLED] ?? true,
    notificationsTaskValidationEnabled:
      data[DB_FIELD_NOTIFICATIONS_TASK_VALIDATION_ENABLED] ?? true,
    notificationsMemberJoinedEnabled:
      data[DB_FIELD_NOTIFICATIONS_MEMBER_JOINED_ENABLED] ?? true,
    notificationsMemberLeftEnabled:
      data[DB_FIELD_NOTIFICATIONS_MEMBER_LEFT_ENABLED] ?? true,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

export const useUserPreferences = () => {
  const { data: session } = useAuthSession();
  const queryClient = useQueryClient();
  const previousValuesRef = useRef<{
    theme?: Theme;
    language?: AppLanguage;
    notificationsEnabled?: boolean;
  }>({});
  const query = useQuery<UserPreferences | null>({
    queryKey: RQKEY_PREFERENCES,
    queryFn: async () => {
      if (!session?.user?.id) {
        return null;
      }

      const { data, error } = await supabase
        .from(DB_TABLE_USER_PREFERENCES)
        .select('*')
        .eq(DB_FIELD_USER_ID, session.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      return mapUserPreferencesFromDb(data);
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    retry: false,
    initialData: () => {
      const cached = queryClient.getQueryData<UserPreferences | null>(RQKEY_PREFERENCES);

      return cached ?? undefined;
    },
    placeholderData: () => {
      return (
        queryClient.getQueryData<UserPreferences | null>(RQKEY_PREFERENCES) ?? undefined
      );
    },
  });

  useEffect(() => {
    if (query.data) {
      const syncToLocalStorage = async () => {
        const preferences = query.data;

        if (!preferences) return;

        const previousValues = previousValuesRef.current;
        const hasThemeChanged = previousValues.theme !== preferences.theme;
        const hasLanguageChanged = previousValues.language !== preferences.language;
        const hasNotificationsChanged =
          previousValues.notificationsEnabled !== preferences.notificationsEnabled;

        if (hasThemeChanged || hasNotificationsChanged) {
          await device.set([STORAGE_KEY_PREFERENCES], {
            theme: preferences.theme,
            notificationsEnabled: preferences.notificationsEnabled,
          });
        }

        if (hasLanguageChanged) {
          await device.set([STORAGE_KEY_APP_LANGUAGE], preferences.language);
          dynamicActivate(preferences.language);
        }

        previousValuesRef.current = {
          theme: preferences.theme,
          language: preferences.language,
          notificationsEnabled: preferences.notificationsEnabled,
        };
      };

      syncToLocalStorage();
    }
  }, [query.data]);

  return query;
};
