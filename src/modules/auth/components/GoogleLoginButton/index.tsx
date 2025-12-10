import React from 'react';
import { Button, ButtonText, ButtonSpinner } from '@gluestack-ui/themed';
import { useGoogleLogin } from '@modules/auth/hooks/useGoogleLogin';

import { GoogleLoginButtonProps } from './types';
import GOOGLE_LOGIN_BUTTON_LABELS from './constants';

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess }) => {
  const { mutate: loginWithGoogle, isPending } = useGoogleLogin();
  const handlePress = () => {
    loginWithGoogle(undefined, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <Button
      variant="outline"
      action="primary"
      size="md"
      onPress={handlePress}
      isDisabled={isPending}
      isFocusVisible={false}
      accessibilityRole="button"
      accessibilityLabel={GOOGLE_LOGIN_BUTTON_LABELS.LOGIN_WITH_GOOGLE}
      accessibilityState={{ disabled: isPending }}
    >
      {isPending ? (
        <ButtonSpinner />
      ) : (
        <ButtonText>{GOOGLE_LOGIN_BUTTON_LABELS.LOGIN_WITH_GOOGLE}</ButtonText>
      )}
    </Button>
  );
};
