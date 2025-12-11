import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useLingui } from '@lingui/react';
import { Box, VStack, Text } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useLogout } from '@modules/auth/hooks/useLogut';

import { ACCOUNT_CONSTANTS } from '../../constants/account.constants';
import { ProfileMenuItem } from '../../components/ProfileMenuItem';
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
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        AccountCoordinator.navigateToAuth();
      },
    });
  };
  const menuItems: MenuItemConfig[] = useMemo(
    () => [
      {
        leftIcon: 'document-text-outline',
        titleKey: 'MENU_ITEM_PLAN_PRO_TITLE',
        descriptionKey: 'MENU_ITEM_PLAN_PRO_DESCRIPTION',
        rightElement: { type: 'icon', name: 'chevron-forward-outline' },
      },
      {
        leftIcon: 'trending-up-outline',
        titleKey: 'MENU_ITEM_INVESTMENTS_TITLE',
        descriptionKey: 'MENU_ITEM_INVESTMENTS_DESCRIPTION',
        rightElement: { type: 'icon', name: 'chevron-forward-outline' },
      },
      {
        leftIcon: 'settings-outline',
        titleKey: 'MENU_ITEM_PREFERENCES_TITLE',
        descriptionKey: 'MENU_ITEM_PREFERENCES_DESCRIPTION',
        rightElement: { type: 'icon', name: 'chevron-forward-outline' },
      },
      {
        leftIcon: 'log-out-outline',
        titleKey: 'MENU_ITEM_LOGOUT_TITLE',
        rightElement: { type: 'none' },
        onPress: handleLogout,
      },
    ],
    [handleLogout],
  );

  return (
    <Box style={styles.container}>
      <Box style={styles.header}>
        <Text style={styles.headerTitle}>{_(ACCOUNT_CONSTANTS.PROFILE_TITLE)}</Text>
      </Box>
      <ScrollView>
        <VStack style={styles.profileSection} alignItems="center">
          <Box style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={80} color="#FFFFFF" />
          </Box>
          <Text style={styles.userName}>
            {_(ACCOUNT_CONSTANTS.PROFILE_USER_PLACEHOLDER)}
          </Text>
        </VStack>
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
