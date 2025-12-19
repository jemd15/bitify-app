import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@lib/supabase';
import { useAuthSession } from '@modules/auth/hooks/useAuthSession';
import { device } from '@shared/storage';
import { logger } from '@shared/logger';
import { dynamicActivate } from '@locale/i18n';
import { AppLanguage } from '@locale/languages';

import {
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
  THEME_VALUE_AUTO,
  DEFAULT_NOTIFICATIONS_ENABLED,
  ERROR_MESSAGE_USER_NOT_AUTHENTICATED,
} from '../constants/account.constants';
import { RQKEY_PREFERENCES } from './useUserPreferences';
import type {
  UpdateUserPreferencesParams,
  UserPreferences,
} from '../types/account.types';

const mapUserPreferencesFromDb = (data: any): UserPreferences => {
  return {
    id: data.id,
    userId: data[DB_FIELD_USER_ID],
    theme: data[DB_FIELD_THEME],
    language: data[DB_FIELD_LANGUAGE],
    notificationsEnabled: data[DB_FIELD_NOTIFICATIONS_ENABLED],
    notificationsTaskReminderEnabled: data[DB_FIELD_NOTIFICATIONS_TASK_REMINDER_ENABLED],
    notificationsTaskValidationEnabled:
      data[DB_FIELD_NOTIFICATIONS_TASK_VALIDATION_ENABLED],
    notificationsMemberJoinedEnabled: data[DB_FIELD_NOTIFICATIONS_MEMBER_JOINED_ENABLED],
    notificationsMemberLeftEnabled: data[DB_FIELD_NOTIFICATIONS_MEMBER_LEFT_ENABLED],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

export const useUpdateUserPreferences = () => {
  const { data: session } = useAuthSession();
  const queryClient = useQueryClient();

  return useMutation<
    UserPreferences,
    Error,
    UpdateUserPreferencesParams,
    {
      previousPreferences: UserPreferences | null | undefined;
      previousStorageState: {
        preferences: any;
        appLanguage: AppLanguage | undefined;
      };
    }
  >({
    mutationFn: async params => {
      if (!session?.user?.id) {
        throw new Error(ERROR_MESSAGE_USER_NOT_AUTHENTICATED);
      }

      const updateData: any = {
        [DB_FIELD_USER_ID]: session.user.id,
      };

      if (params.theme !== undefined) {
        updateData[DB_FIELD_THEME] = params.theme;
      }

      if (params.language !== undefined) {
        updateData[DB_FIELD_LANGUAGE] = params.language;
      }

      if (params.notificationsEnabled !== undefined) {
        updateData[DB_FIELD_NOTIFICATIONS_ENABLED] = params.notificationsEnabled;
      }

      if (params.notificationsTaskReminderEnabled !== undefined) {
        updateData[DB_FIELD_NOTIFICATIONS_TASK_REMINDER_ENABLED] =
          params.notificationsTaskReminderEnabled;
      }

      if (params.notificationsTaskValidationEnabled !== undefined) {
        updateData[DB_FIELD_NOTIFICATIONS_TASK_VALIDATION_ENABLED] =
          params.notificationsTaskValidationEnabled;
      }

      if (params.notificationsMemberJoinedEnabled !== undefined) {
        updateData[DB_FIELD_NOTIFICATIONS_MEMBER_JOINED_ENABLED] =
          params.notificationsMemberJoinedEnabled;
      }

      if (params.notificationsMemberLeftEnabled !== undefined) {
        updateData[DB_FIELD_NOTIFICATIONS_MEMBER_LEFT_ENABLED] =
          params.notificationsMemberLeftEnabled;
      }

      const { data, error } = await supabase
        .from(DB_TABLE_USER_PREFERENCES)
        .upsert(updateData, {
          onConflict: DB_FIELD_USER_ID,
        })
        .select()
        .single();

      if (error) {
        logger.error(error);
        throw error;
      }

      return mapUserPreferencesFromDb(data);
    },
    onMutate: async params => {
      await queryClient.cancelQueries({ queryKey: RQKEY_PREFERENCES });

      const previousPreferences = queryClient.getQueryData<UserPreferences | null>(
        RQKEY_PREFERENCES,
      );
      const previousStorageState = {
        preferences: await device.get([STORAGE_KEY_PREFERENCES]),
        appLanguage: (await device.get([STORAGE_KEY_APP_LANGUAGE])) as
          | AppLanguage
          | undefined,
      };

      queryClient.setQueryData<UserPreferences | null>(RQKEY_PREFERENCES, old => {
        if (!old) return old;

        return {
          ...old,
          ...(params.theme !== undefined && { theme: params.theme }),
          ...(params.language !== undefined && { language: params.language }),
          ...(params.notificationsEnabled !== undefined && {
            notificationsEnabled: params.notificationsEnabled,
          }),
          ...(params.notificationsTaskReminderEnabled !== undefined && {
            notificationsTaskReminderEnabled: params.notificationsTaskReminderEnabled,
          }),
          ...(params.notificationsTaskValidationEnabled !== undefined && {
            notificationsTaskValidationEnabled: params.notificationsTaskValidationEnabled,
          }),
          ...(params.notificationsMemberJoinedEnabled !== undefined && {
            notificationsMemberJoinedEnabled: params.notificationsMemberJoinedEnabled,
          }),
          ...(params.notificationsMemberLeftEnabled !== undefined && {
            notificationsMemberLeftEnabled: params.notificationsMemberLeftEnabled,
          }),
        };
      });
      if (params.theme !== undefined) {
        const currentPreferences = (await device.get([STORAGE_KEY_PREFERENCES])) || {
          theme: THEME_VALUE_AUTO,
          notificationsEnabled: DEFAULT_NOTIFICATIONS_ENABLED,
        };
        await device.set([STORAGE_KEY_PREFERENCES], {
          ...currentPreferences,
          theme: params.theme,
        });
      }
      if (params.language !== undefined) {
        await device.set([STORAGE_KEY_APP_LANGUAGE], params.language);
        dynamicActivate(params.language);
      }
      if (params.notificationsEnabled !== undefined) {
        const currentPreferences = (await device.get([STORAGE_KEY_PREFERENCES])) || {
          theme: THEME_VALUE_AUTO,
          notificationsEnabled: DEFAULT_NOTIFICATIONS_ENABLED,
        };
        await device.set([STORAGE_KEY_PREFERENCES], {
          ...currentPreferences,
          notificationsEnabled: params.notificationsEnabled,
        });
      }

      return { previousPreferences, previousStorageState };
    },
    onError: async (error, params, context) => {
      logger.error(error);

      if (context?.previousPreferences !== undefined) {
        queryClient.setQueryData(RQKEY_PREFERENCES, context.previousPreferences);
      }

      if (context?.previousStorageState) {
        if (context.previousStorageState.preferences) {
          await device.set(
            [STORAGE_KEY_PREFERENCES],
            context.previousStorageState.preferences,
          );
        }
        if (context.previousStorageState.appLanguage !== undefined) {
          await device.set(
            [STORAGE_KEY_APP_LANGUAGE],
            context.previousStorageState.appLanguage,
          );
          dynamicActivate(context.previousStorageState.appLanguage as AppLanguage);
        }
      }
    },
    onSuccess: async data => {
      queryClient.setQueryData(RQKEY_PREFERENCES, data);
      await device.set([STORAGE_KEY_PREFERENCES], {
        theme: data.theme,
        notificationsEnabled: data.notificationsEnabled,
      });
      await device.set([STORAGE_KEY_APP_LANGUAGE], data.language);
      dynamicActivate(data.language);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: RQKEY_PREFERENCES });
    },
  });
};
