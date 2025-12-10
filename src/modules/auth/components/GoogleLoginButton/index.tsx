import React from 'react';
import { Button } from '@shared/components/Button';
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
      title={GOOGLE_LOGIN_BUTTON_LABELS.LOGIN_WITH_GOOGLE}
      onPress={handlePress}
      loading={isPending}
      disabled={isPending}
      variant="outline"
    />
  );
};
