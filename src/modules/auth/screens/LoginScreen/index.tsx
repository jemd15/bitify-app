import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LoginForm } from '@modules/auth/components/LoginForm';
import { GoogleLoginButton } from '@modules/auth/components/GoogleLoginButton';
import { AuthCoordinator } from '@modules/auth/coordinator/AuthCoordinator';

import { styles } from './styles';
import LOGIN_LABELS from './constants';

export const LoginScreen: React.FC = () => {
  const handleLoginSuccess = () => {
    AuthCoordinator.navigateToHome();
  };
  const handleNavigateToCreateAccount = () => {
    AuthCoordinator.navigateToCreateAccount();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{LOGIN_LABELS.TITLE}</Text>
        <Text style={styles.subtitle}>{LOGIN_LABELS.SUBTITLE}</Text>
      </View>

      <View style={styles.form}>
        <LoginForm onSuccess={handleLoginSuccess} />
        <View style={styles.divider}>
          <Text style={styles.dividerText}>{LOGIN_LABELS.OR}</Text>
        </View>
        <GoogleLoginButton onSuccess={handleLoginSuccess} />
      </View>

      <Pressable onPress={handleNavigateToCreateAccount} style={styles.footerLink}>
        <Text style={styles.footerLinkText}>{LOGIN_LABELS.NO_ACCOUNT}</Text>
        <Text style={styles.footerLinkButton}>{LOGIN_LABELS.CREATE_ACCOUNT}</Text>
      </Pressable>
    </View>
  );
};
