import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TASKS_CONSTANTS } from "../constants/tasks.constants";

export const CreateTaskScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TASKS_CONSTANTS.CREATE_TITLE || "Create Task"}</Text>
      <Text style={styles.subtitle}>Create a new task</Text>
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


