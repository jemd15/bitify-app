import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HouseListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My House</Text>
      <Text style={styles.subtitle}>House list</Text>
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
