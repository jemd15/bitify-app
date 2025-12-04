import React from 'react';
import { View, Text } from 'react-native';

import { ACCOUNT_CONSTANTS } from '../../constants/account.constants';
import type { ProfileScreenProps } from '../../types/account.types';
import { styles } from './styles';

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ACCOUNT_CONSTANTS.PROFILE_TITLE}</Text>
      <Text style={styles.subtitle}>User profile information</Text>
    </View>
  );
};
