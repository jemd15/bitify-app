import React from 'react';
import { View, Text } from 'react-native';
import { t, Trans } from '@lingui/macro';
import { Button, ButtonText } from '@gluestack-ui/themed';

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
        <Button
          variant="link"
          action="primary"
          size="sm"
          onPress={onDismiss}
          isFocusVisible={false}
          accessibilityRole="button"
          accessibilityLabel={t`Dismiss`}
        >
          <ButtonText>{t`Dismiss`}</ButtonText>
        </Button>
      )}
    </View>
  );
};
