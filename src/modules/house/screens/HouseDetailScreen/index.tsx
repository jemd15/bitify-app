import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { styles } from './styles';

export const HouseDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>House Detail</Text>
      <Text style={styles.subtitle}>House ID: {id}</Text>
    </View>
  );
};
