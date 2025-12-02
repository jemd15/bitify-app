import { router } from "expo-router";

export class AccountCoordinator {
  /**
   * Navigate to profile screen
   */
  static navigateToProfile() {
    router.push("/(tabs)/profile");
  }

  /**
   * Navigate to user settings
   */
  static navigateToSettings() {
    router.push("/account/settings");
  }

  /**
   * Navigate to authentication screen
   */
  static navigateToAuth() {
    router.push("/account/auth");
  }

  /**
   * Navigate to user profile edit
   */
  static navigateToEditProfile() {
    router.push("/account/edit");
  }

  /**
   * Go back to previous screen
   */
  static goBack() {
    router.back();
  }
}


