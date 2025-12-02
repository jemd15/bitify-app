import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ACCOUNT_CONSTANTS } from "../constants/account.constants";
import type { ProfileScreenProps } from "../types/account.types";

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ACCOUNT_CONSTANTS.PROFILE_TITLE}</Text>
      <Text style={styles.subtitle}>User profile information</Text>
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


