import { router } from 'expo-router';

export class HomeCoordinator {
  /**
   * Navigate to home screen
   */
  static navigateToHome() {
    router.push('/(tabs)/home');
  }

  /**
   * Navigate to a specific section within home
   */
  static navigateToSection(section: string) {
    // Future navigation logic for home sections
    console.log(`Navigating to section: ${section}`);
  }
}
