import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { TASKS_CONSTANTS } from '../constants/tasks.constants';

export const CreateTaskScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TASKS_CONSTANTS.CREATE_TITLE || 'Create Task'}</Text>
      <Text style={styles.subtitle}>Create a new task</Text>
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
