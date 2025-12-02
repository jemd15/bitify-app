import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TASKS_CONSTANTS } from "../constants/tasks.constants";

export const TasksListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TASKS_CONSTANTS.LIST_TITLE || "Tasks"}</Text>
      <Text style={styles.subtitle}>Your tasks list</Text>
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


