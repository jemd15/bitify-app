import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});


