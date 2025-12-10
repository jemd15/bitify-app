import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  InputSlot,
} from '@gluestack-ui/themed';
import { useSignUp } from '@modules/auth/hooks/useSignUp';
import { signupSchema } from '@modules/auth/domain/validators/signup.validator';
import type { SignUpInput } from '@modules/auth/domain/validators/signup.validator';

import { CreateAccountFormProps } from './types';
import { errorMessages, CREATE_ACCOUNT_FORM_LABELS } from './constants';

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <View>
      <FormControl isInvalid={!!errors.email} marginBottom="$4">
        <FormControlLabel>
          <FormControlLabelText>{CREATE_ACCOUNT_FORM_LABELS.EMAIL}</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isPending}
            accessibilityLabel={CREATE_ACCOUNT_FORM_LABELS.EMAIL}
            accessibilityState={{ disabled: !!errors.email }}
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
          <FormControlLabelText>
            {CREATE_ACCOUNT_FORM_LABELS.PASSWORD}
          </FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isPending}
            accessibilityLabel={CREATE_ACCOUNT_FORM_LABELS.PASSWORD}
            accessibilityState={{ disabled: !!errors.password }}
          />
          <InputSlot onPress={togglePasswordVisibility} pr="$3">
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#666"
            />
          </InputSlot>
        </Input>
        {errors.password && (
          <FormControlError>
            <FormControlErrorText>{errors.password}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
      <FormControl isInvalid={!!errors.confirmPassword} marginBottom="$4">
        <FormControlLabel>
          <FormControlLabelText>
            {CREATE_ACCOUNT_FORM_LABELS.CONFIRM_PASSWORD}
          </FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            editable={!isPending}
            accessibilityLabel={CREATE_ACCOUNT_FORM_LABELS.CONFIRM_PASSWORD}
            accessibilityState={{ disabled: !!errors.confirmPassword }}
          />
          <InputSlot onPress={toggleConfirmPasswordVisibility} pr="$3">
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#666"
            />
          </InputSlot>
        </Input>
        {errors.confirmPassword && (
          <FormControlError>
            <FormControlErrorText>{errors.confirmPassword}</FormControlErrorText>
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
        accessibilityLabel={CREATE_ACCOUNT_FORM_LABELS.CREATE_ACCOUNT}
        accessibilityState={{ disabled: isPending }}
      >
        {isPending ? (
          <ButtonSpinner />
        ) : (
          <ButtonText>{CREATE_ACCOUNT_FORM_LABELS.CREATE_ACCOUNT}</ButtonText>
        )}
      </Button>
    </View>
  );
};
