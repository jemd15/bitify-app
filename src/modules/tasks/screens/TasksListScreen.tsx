import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { TASKS_CONSTANTS } from '../constants/tasks.constants';

export const TasksListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TASKS_CONSTANTS.LIST_TITLE || 'Tasks'}</Text>
      <Text style={styles.subtitle}>Your tasks list</Text>
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
