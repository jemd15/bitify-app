import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Input } from '@shared/components/Input';
import { Button } from '@shared/components/Button';
import { useLogin } from '@modules/auth/hooks/useLogin';
import { loginSchema } from '@modules/auth/domain/validators/login.validator';
import type { LoginInput } from '@modules/auth/domain/validators/login.validator';
import { AuthCoordinator } from '@modules/auth/coordinator/AuthCoordinator';

import { LoginFormProps } from './types';
import { errorMessages, LOGIN_FORM_LABELS } from './constants';
import { styles } from './styles';

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const { mutate: login, isPending } = useLogin();
  const handleSubmit = () => {
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] ? errorMessages[fieldErrors.email[0]] : undefined,
        password: fieldErrors.password?.[0]
          ? errorMessages[fieldErrors.password[0]]
          : undefined,
      });

      return;
    }

    setErrors({});
    login(result.data, {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: error => {
        setErrors({ email: error.message });
      },
    });
  };
  const handleForgotPassword = () => {
    AuthCoordinator.navigateToForgotPassword();
  };

  return (
    <View>
      <Input
        label={LOGIN_FORM_LABELS.EMAIL}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        editable={!isPending}
      />
      <Input
        label={LOGIN_FORM_LABELS.PASSWORD}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
        editable={!isPending}
      />
      <Button
        title={LOGIN_FORM_LABELS.LOGIN}
        onPress={handleSubmit}
        loading={isPending}
        disabled={isPending}
      />
      <Pressable onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>{LOGIN_FORM_LABELS.FORGOT_PASSWORD}</Text>
      </Pressable>
    </View>
  );
};
