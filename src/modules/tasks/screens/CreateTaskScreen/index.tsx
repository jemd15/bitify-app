import React from 'react';
import { View, Text } from 'react-native';

import { TASKS_CONSTANTS } from '../../constants/tasks.constants';
import { styles } from './styles';

export const CreateTaskScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TASKS_CONSTANTS.CREATE_TITLE || 'Create Task'}</Text>
      <Text style={styles.subtitle}>Create a new task</Text>
    </View>
  );
};
