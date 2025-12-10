import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Button } from '@shared/components/Button';
import { AuthCoordinator } from '@modules/auth/coordinator/AuthCoordinator';

import { styles } from './styles';
import WELCOME_LABELS from './constants';

export const WelcomeScreen: React.FC = () => {
  const handleCreateAccount = () => {
    AuthCoordinator.navigateToCreateAccount();
  };
  const handleLogin = () => {
    AuthCoordinator.navigateToLogin();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{WELCOME_LABELS.TITLE}</Text>
          <Text style={styles.subtitle}>{WELCOME_LABELS.SUBTITLE}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title={WELCOME_LABELS.CREATE_ACCOUNT}
          onPress={handleCreateAccount}
          variant="solid"
          color="primary"
          size="large"
        />
        <Pressable onPress={handleLogin} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>{WELCOME_LABELS.ALREADY_HAVE_ACCOUNT}</Text>
          <Text style={styles.loginLinkButton}>{WELCOME_LABELS.LOGIN}</Text>
        </Pressable>
      </View>
    </View>
  );
};
