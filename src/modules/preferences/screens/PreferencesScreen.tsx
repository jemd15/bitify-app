import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PREFERENCES_CONSTANTS } from "../constants/preferences.constants";

export const PreferencesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{PREFERENCES_CONSTANTS.TITLE}</Text>
      <Text style={styles.subtitle}>{PREFERENCES_CONSTANTS.SUBTITLE}</Text>
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


