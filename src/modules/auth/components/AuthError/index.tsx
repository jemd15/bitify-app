import React from 'react';
import { View, Text } from 'react-native';
import { t, Trans } from '@lingui/macro';
import { Button } from '@shared/components';

import { styles } from './styles';
import { AuthErrorProps } from './types';

export const AuthError: React.FC<AuthErrorProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        <Trans>{message}</Trans>
      </Text>
      {onDismiss && (
        <Button title={t`Dismiss`} onPress={onDismiss} variant="ghost" size="small" />
      )}
    </View>
  );
};
