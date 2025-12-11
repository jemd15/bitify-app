import { router } from 'expo-router';

export class AuthCoordinator {
  static navigateToLogin() {
    router.replace('/account/login');
  }

  static navigateToCreateAccount() {
    router.replace('/account/create-account');
  }

  static navigateToHome() {
    router.replace('/(tabs)/home');
  }

  static navigateToSignup() {
    router.replace('/account/signup');
  }

  static navigateToForgotPassword() {
    router.push('/account/forgot-password');
  }
}
