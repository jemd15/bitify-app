import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Button,
  ButtonText,
  ButtonSpinner,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
} from '@gluestack-ui/themed';
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
      <FormControl isInvalid={!!errors.email} marginBottom="$4">
        <FormControlLabel>
          <FormControlLabelText>{LOGIN_FORM_LABELS.EMAIL}</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isPending}
            accessibilityLabel={LOGIN_FORM_LABELS.EMAIL}
            accessibilityState={{ invalid: !!errors.email }}
          />
        </Input>
        {errors.email && (
          <FormControlError>
            <FormControlErrorText>{errors.email}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
      <FormControl isInvalid={!!errors.password} marginBottom="$4">
        <FormControlLabel>
          <FormControlLabelText>{LOGIN_FORM_LABELS.PASSWORD}</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isPending}
            accessibilityLabel={LOGIN_FORM_LABELS.PASSWORD}
            accessibilityState={{ invalid: !!errors.password }}
          />
        </Input>
        {errors.password && (
          <FormControlError>
            <FormControlErrorText>{errors.password}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
      <Button
        variant="solid"
        action="primary"
        size="md"
        onPress={handleSubmit}
        isDisabled={isPending}
        isFocusVisible={false}
        accessibilityRole="button"
        accessibilityLabel={LOGIN_FORM_LABELS.LOGIN}
        accessibilityState={{ disabled: isPending }}
        marginBottom="$1"
      >
        {isPending ? (
          <ButtonSpinner />
        ) : (
          <ButtonText>{LOGIN_FORM_LABELS.LOGIN}</ButtonText>
        )}
      </Button>
      <Pressable onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>{LOGIN_FORM_LABELS.FORGOT_PASSWORD}</Text>
      </Pressable>
    </View>
  );
};
