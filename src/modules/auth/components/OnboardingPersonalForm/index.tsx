import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  Text,
  Spinner,
} from '@gluestack-ui/themed';
import { z } from 'zod';

import { OnboardingPersonalFormProps } from './types';
import { errorMessages, ONBOARDING_PERSONAL_FORM_LABELS } from './constants';
import { styles } from './styles';

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
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
  const [isUploading, setIsUploading] = useState(false);
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

  const handleSelectAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        setErrors({ avatar: 'Permission to access media library is required' });

        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];

      if (!asset.type || !ALLOWED_IMAGE_TYPES.includes(asset.type)) {
        setErrors({ avatar: errorMessages.AVATAR_INVALID_FORMAT });

        return;
      }

      if (asset.fileSize && asset.fileSize > MAX_AVATAR_SIZE) {
        setErrors({ avatar: errorMessages.AVATAR_TOO_LARGE });

        return;
      }

      setAvatarUri(asset.uri);
      setAvatarBase64(asset.base64 || undefined);
      setAvatarType(asset.type || 'image/jpeg');
      setErrors({ avatar: undefined });
    } catch (error) {
      setErrors({ avatar: 'Failed to select image' });
    }
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
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-outline" size={48} color="#999" />
            </View>
          )}
          <Pressable
            onPress={handleSelectAvatar}
            disabled={isUploading}
            style={styles.avatarButton}
          >
            <Text style={styles.avatarButtonText}>
              {avatarUri
                ? ONBOARDING_PERSONAL_FORM_LABELS.CHANGE_AVATAR
                : ONBOARDING_PERSONAL_FORM_LABELS.SELECT_AVATAR}
            </Text>
          </Pressable>
          {isUploading && <Spinner size="small" />}
        </View>
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
            editable={!isUploading}
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
            editable={!isUploading}
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
