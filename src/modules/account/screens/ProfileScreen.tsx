import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { ACCOUNT_CONSTANTS } from '../constants/account.constants';
import type { ProfileScreenProps } from '../types/account.types';

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ACCOUNT_CONSTANTS.PROFILE_TITLE}</Text>
      <Text style={styles.subtitle}>User profile information</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

