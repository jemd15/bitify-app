import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HOME_CONSTANTS } from "../constants/home.constants";
import type { HomeScreenProps } from "../types/home.types";

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{HOME_CONSTANTS.TITLE}</Text>
      <Text style={styles.subtitle}>{HOME_CONSTANTS.SUBTITLE}</Text>
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


