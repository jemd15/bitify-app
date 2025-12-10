import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from '@shared/components/Input';
import { Button } from '@shared/components/Button';
import { useSignUp } from '@modules/auth/hooks/useSignUp';
import { signupSchema } from '@modules/auth/domain/validators/signup.validator';
import type { SignUpInput } from '@modules/auth/domain/validators/signup.validator';

import { CreateAccountFormProps } from './types';
import { errorMessages, CREATE_ACCOUNT_FORM_LABELS } from './constants';

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpInput | 'confirmPassword', string>>
  >({});
  const { mutate: signUp, isPending } = useSignUp();
  const handleSubmit = () => {
    const result = signupSchema.safeParse({ email, password, confirmPassword });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] ? errorMessages[fieldErrors.email[0]] : undefined,
        password: fieldErrors.password?.[0]
          ? errorMessages[fieldErrors.password[0]]
          : undefined,
        confirmPassword: fieldErrors.confirmPassword?.[0]
          ? errorMessages[fieldErrors.confirmPassword[0]]
          : undefined,
      });

      return;
    }

    setErrors({});
    signUp(result.data, {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: error => {
        setErrors({ email: error.message });
      },
    });
  };

  return (
    <View>
      <Input
        label={CREATE_ACCOUNT_FORM_LABELS.EMAIL}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        editable={!isPending}
      />
      <Input
        label={CREATE_ACCOUNT_FORM_LABELS.PASSWORD}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
        editable={!isPending}
      />
      <Input
        label={CREATE_ACCOUNT_FORM_LABELS.CONFIRM_PASSWORD}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        error={errors.confirmPassword}
        editable={!isPending}
      />
      <Button
        title={CREATE_ACCOUNT_FORM_LABELS.CREATE_ACCOUNT}
        onPress={handleSubmit}
        loading={isPending}
        disabled={isPending}
      />
    </View>
  );
};
