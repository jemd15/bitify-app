import React from 'react';
import { View, Text } from 'react-native';

import { styles } from './styles';

export const HouseListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My House</Text>
      <Text style={styles.subtitle}>House list</Text>
    </View>
  );
};
