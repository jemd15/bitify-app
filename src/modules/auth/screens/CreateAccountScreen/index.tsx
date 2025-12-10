import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CreateAccountForm } from '@modules/auth/components/CreateAccountForm';
import { GoogleLoginButton } from '@modules/auth/components/GoogleLoginButton';
import { AuthCoordinator } from '@modules/auth/coordinator/AuthCoordinator';

import { styles } from './styles';
import CREATE_ACCOUNT_LABELS from './constants';

export const CreateAccountScreen: React.FC = () => {
  const handleSignUpSuccess = () => {
    AuthCoordinator.navigateToHome();
  };
  const handleNavigateToLogin = () => {
    AuthCoordinator.navigateToLogin();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{CREATE_ACCOUNT_LABELS.TITLE}</Text>
        <Text style={styles.subtitle}>{CREATE_ACCOUNT_LABELS.SUBTITLE}</Text>
      </View>

      <View style={styles.form}>
        <CreateAccountForm onSuccess={handleSignUpSuccess} />
        <View style={styles.divider}>
          <Text style={styles.dividerText}>{CREATE_ACCOUNT_LABELS.OR}</Text>
        </View>
        <GoogleLoginButton onSuccess={handleSignUpSuccess} />
      </View>

      <Pressable onPress={handleNavigateToLogin} style={styles.footerLink}>
        <Text style={styles.footerLinkText}>
          {CREATE_ACCOUNT_LABELS.ALREADY_HAVE_ACCOUNT}
        </Text>
        <Text style={styles.footerLinkButton}>{CREATE_ACCOUNT_LABELS.LOGIN}</Text>
      </Pressable>
    </View>
  );
};
