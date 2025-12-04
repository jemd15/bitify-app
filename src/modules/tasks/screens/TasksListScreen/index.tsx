import React from 'react';
import { View, Text } from 'react-native';

import { TASKS_CONSTANTS } from '../../constants/tasks.constants';
import { styles } from './styles';

export const TasksListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TASKS_CONSTANTS.LIST_TITLE || 'Tasks'}</Text>
      <Text style={styles.subtitle}>Your tasks list</Text>
    </View>
  );
};
