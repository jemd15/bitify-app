import React, { useMemo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useLingui } from '@lingui/react';
import { Box, VStack, Text } from '@gluestack-ui/themed';
import { useLogout } from '@modules/auth/hooks/useLogut';
import { useProfile } from '@modules/account/hooks/useProfile';
import { useUpdateProfile } from '@modules/account/hooks/useUpdateProfile';
import { useUserPreferences } from '@modules/account/hooks/useUserPreferences';
import { useUpdateUserPreferences } from '@modules/account/hooks/useUpdateUserPreferences';
import { AvatarHeader } from '@shared/components';
import { SUPPORTED_LANGUAGES, AppLanguage } from '@locale/languages';

import type { Theme } from '../../types/account.types';
import {
  ACCOUNT_CONSTANTS,
  THEME_VALUE_LIGHT,
  THEME_VALUE_DARK,
  THEME_VALUE_AUTO,
  LANGUAGE_VALUE_ES,
  DEFAULT_NOTIFICATIONS_ENABLED,
} from '../../constants/account.constants';
import { ProfileMenuItem } from '../../components/ProfileMenuItem';
import { useUploadAvatar } from '../../hooks/useUploadAvatar';
import { AccountCoordinator } from '../../coordinator/AccountCoordinator';
import type { ProfileScreenProps } from '../../types/account.types';
import type { RightElement } from '../../components/ProfileMenuItem/types';
import { styles } from './styles';

interface MenuItemConfig {
  leftIcon: string;
  titleKey: keyof typeof ACCOUNT_CONSTANTS;
  descriptionKey?: keyof typeof ACCOUNT_CONSTANTS;
  rightElement: RightElement;
  onPress?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { _ } = useLingui();
  const logoutMutation = useLogout();
  const { data: profile } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const { data: preferences } = useUserPreferences();
  const updatePreferencesMutation = useUpdateUserPreferences();
  const theme = (preferences?.theme || THEME_VALUE_AUTO) as Theme;
  const language = (preferences?.language || LANGUAGE_VALUE_ES) as AppLanguage;
  const notificationsEnabled =
    preferences?.notificationsEnabled ?? DEFAULT_NOTIFICATIONS_ENABLED;
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        AccountCoordinator.navigateToAuth();
      },
    });
  };
  const handleAvatarChange = async (avatarUrl: string) => {
    await updateProfileMutation.mutateAsync({
      avatarUrl,
    });
  };
  const handleProPlan = () => {};
  const handleThemeChange = useCallback(
    async (value: string) => {
      await updatePreferencesMutation.mutateAsync({ theme: value as Theme });
    },
    [updatePreferencesMutation],
  );
  const handleLanguageChange = useCallback(
    async (value: string) => {
      await updatePreferencesMutation.mutateAsync({ language: value as AppLanguage });
    },
    [updatePreferencesMutation],
  );
  const handleNotificationsChange = useCallback(
    async (value: boolean) => {
      await updatePreferencesMutation.mutateAsync({ notificationsEnabled: value });
    },
    [updatePreferencesMutation],
  );
  const themeOptions = useMemo(
    () => [
      { label: _(ACCOUNT_CONSTANTS.THEME_LIGHT), value: THEME_VALUE_LIGHT },
      { label: _(ACCOUNT_CONSTANTS.THEME_DARK), value: THEME_VALUE_DARK },
      { label: _(ACCOUNT_CONSTANTS.THEME_AUTO), value: THEME_VALUE_AUTO },
    ],
    [_],
  );
  const languageOptions = useMemo(
    () =>
      SUPPORTED_LANGUAGES.map(lang => ({
        label: lang.nativeLabel,
        value: lang.code,
      })),
    [],
  );
  const menuItems: MenuItemConfig[] = useMemo(
    () => [
      {
        leftIcon: 'star-outline',
        titleKey: 'MENU_ITEM_PRO_PLAN_TITLE',
        descriptionKey: 'MENU_ITEM_PRO_PLAN_DESCRIPTION',
        rightElement: { type: 'icon', name: 'chevron-forward-outline' },
        onPress: handleProPlan,
      },
      {
        leftIcon: 'color-palette-outline',
        titleKey: 'MENU_ITEM_THEME_TITLE',
        descriptionKey: 'MENU_ITEM_THEME_DESCRIPTION',
        rightElement: {
          type: 'select',
          value: theme ?? THEME_VALUE_AUTO,
          options: themeOptions,
          onValueChange: handleThemeChange,
        },
      },
      {
        leftIcon: 'language-outline',
        titleKey: 'MENU_ITEM_LANGUAGE_TITLE',
        descriptionKey: 'MENU_ITEM_LANGUAGE_DESCRIPTION',
        rightElement: {
          type: 'select',
          value: language ?? LANGUAGE_VALUE_ES,
          options: languageOptions,
          onValueChange: handleLanguageChange,
        },
      },
      {
        leftIcon: 'notifications-outline',
        titleKey: 'MENU_ITEM_NOTIFICATIONS_TITLE',
        descriptionKey: 'MENU_ITEM_NOTIFICATIONS_DESCRIPTION',
        rightElement: {
          type: 'switch',
          value: notificationsEnabled,
          onValueChange: handleNotificationsChange,
        },
      },
      {
        leftIcon: 'log-out-outline',
        titleKey: 'MENU_ITEM_LOGOUT_TITLE',
        rightElement: { type: 'none' },
        onPress: handleLogout,
      },
    ],
    [
      handleLogout,
      handleProPlan,
      handleThemeChange,
      handleLanguageChange,
      handleNotificationsChange,
      theme,
      language,
      notificationsEnabled,
      _,
      themeOptions,
      languageOptions,
    ],
  );

  return (
    <Box style={styles.container}>
      <Box style={styles.header}>
        <Text style={styles.headerTitle}>{_(ACCOUNT_CONSTANTS.PROFILE_TITLE)}</Text>
      </Box>
      <ScrollView>
        <AvatarHeader
          avatarUrl={profile?.avatarUrl ?? undefined}
          fullName={profile?.fullName ?? undefined}
          onAvatarChange={handleAvatarChange}
          uploadAvatarMutation={uploadAvatarMutation}
        />
        <VStack style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <ProfileMenuItem
              key={index}
              leftIcon={item.leftIcon}
              title={_(ACCOUNT_CONSTANTS[item.titleKey])}
              description={
                item.descriptionKey
                  ? _(ACCOUNT_CONSTANTS[item.descriptionKey])
                  : undefined
              }
              rightElement={item.rightElement}
              onPress={item.onPress}
            />
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
};
