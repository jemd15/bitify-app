import { router } from 'expo-router';

export class AuthCoordinator {
  static navigateToLogin() {
    router.push('/account/login');
  }

  static navigateToCreateAccount() {
    router.push('/account/create-account');
  }

  static navigateToHome() {
    router.replace('/(tabs)/home');
  }

  static navigateToSignup() {
    router.push('/account/signup');
  }

  static navigateToForgotPassword() {
    router.push('/account/forgot-password');
  }
}
