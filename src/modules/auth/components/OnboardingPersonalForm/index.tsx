import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import { z } from 'zod';
import { AvatarHeader } from '@shared/components';
import type { ImageSelectData } from '@shared/components';

import { OnboardingPersonalFormProps } from './types';
import { errorMessages, ONBOARDING_PERSONAL_FORM_LABELS } from './constants';
import { styles } from './styles';

const onboardingPersonalSchema = z.object({
  email: z.string().min(1, 'EMAIL_REQUIRED').email('EMAIL_INVALID'),
  fullName: z.string().max(100, 'FULL_NAME_TOO_LONG').optional().or(z.literal('')),
});

export const OnboardingPersonalForm: React.FC<OnboardingPersonalFormProps> = ({
  initialEmail = '',
  initialFullName = '',
  initialAvatarUrl,
  onDataChange,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [fullName, setFullName] = useState(initialFullName);
  const [avatarUri, setAvatarUri] = useState<string | undefined>(initialAvatarUrl);
  const [avatarBase64, setAvatarBase64] = useState<string | undefined>();
  const [avatarType, setAvatarType] = useState<string | undefined>();
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const onDataChangeRef = useRef(onDataChange);

  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  useEffect(() => {
    if (email !== initialEmail) {
      setEmail(initialEmail);
    }
    if (fullName !== initialFullName) {
      setFullName(initialFullName);
    }
    if (initialAvatarUrl !== undefined && avatarUri !== initialAvatarUrl) {
      setAvatarUri(initialAvatarUrl);
    }
  }, [initialEmail, initialFullName, initialAvatarUrl]);

  useEffect(() => {
    if (onDataChangeRef.current) {
      onDataChangeRef.current({
        email,
        fullName,
        avatarUri,
        avatarBase64,
        avatarType,
      });
    }
  }, [email, fullName, avatarUri, avatarBase64, avatarType]);

  const handleImageSelect = (data: ImageSelectData) => {
    setAvatarUri(data.uri);
    setAvatarBase64(data.base64);
    setAvatarType(data.type);
    setErrors({ avatar: undefined });
  };
  const validateForm = (): boolean => {
    const result = onboardingPersonalSchema.safeParse({ email, fullName });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] ? errorMessages[fieldErrors.email[0]] : undefined,
        fullName: fieldErrors.fullName?.[0]
          ? errorMessages[fieldErrors.fullName[0]]
          : undefined,
      });

      return false;
    }

    setErrors({});

    return true;
  };

  useEffect(() => {
    validateForm();
  }, [email, fullName]);

  return (
    <View>
      <FormControl isInvalid={!!errors.avatar} marginBottom="$4">
        <AvatarHeader
          avatarUrl={avatarUri}
          fullName={fullName}
          onImageSelect={handleImageSelect}
        />
        {errors.avatar && (
          <FormControlError>
            <FormControlErrorText>{errors.avatar}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.email} marginBottom="$4">
        <FormControlLabel>
          <FormControlLabelText>
            {ONBOARDING_PERSONAL_FORM_LABELS.EMAIL}
          </FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel={ONBOARDING_PERSONAL_FORM_LABELS.EMAIL}
            accessibilityState={{ disabled: !!errors.email }}
          />
        </Input>
        <View style={styles.errorContainer}>
          {errors.email && (
            <FormControlError>
              <FormControlErrorText>{errors.email}</FormControlErrorText>
            </FormControlError>
          )}
        </View>
      </FormControl>

      <FormControl isInvalid={!!errors.fullName} marginBottom="$4">
        <FormControlLabel>
          <FormControlLabelText>
            {ONBOARDING_PERSONAL_FORM_LABELS.FULL_NAME}
          </FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            accessibilityLabel={ONBOARDING_PERSONAL_FORM_LABELS.FULL_NAME}
            accessibilityState={{ disabled: !!errors.fullName }}
          />
        </Input>
        <View style={styles.errorContainer}>
          {errors.fullName && (
            <FormControlError>
              <FormControlErrorText>{errors.fullName}</FormControlErrorText>
            </FormControlError>
          )}
        </View>
      </FormControl>
    </View>
  );
};
