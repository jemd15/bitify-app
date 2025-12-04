import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { TASKS_CONSTANTS } from '../../constants/tasks.constants';
import { styles } from './styles';

export const TaskDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TASKS_CONSTANTS.DETAIL_TITLE || 'Task Detail'}</Text>
      <Text style={styles.subtitle}>Task ID: {id}</Text>
    </View>
  );
};
