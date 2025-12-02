import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { PREFERENCES_CONSTANTS } from '../constants/preferences.constants';

export const PreferencesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{PREFERENCES_CONSTANTS.TITLE}</Text>
      <Text style={styles.subtitle}>{PREFERENCES_CONSTANTS.SUBTITLE}</Text>
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
