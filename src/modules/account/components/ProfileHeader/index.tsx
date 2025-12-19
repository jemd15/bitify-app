import React, { useState } from 'react';
import { Pressable, Alert } from 'react-native';
import { useLingui } from '@lingui/react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  Box,
  VStack,
  Text,
  Avatar,
  AvatarImage,
  AvatarFallbackText,
  Spinner,
} from '@gluestack-ui/themed';
import { useUploadAvatar } from '@modules/account/hooks/useUploadAvatar';

import {
  ACCOUNT_CONSTANTS,
  MAX_AVATAR_SIZE,
  ALLOWED_IMAGE_TYPES,
  FILE_EXTENSION_TO_MIME_TYPE,
} from '../../constants/account.constants';
import type { ProfileHeaderProps } from './types';
import { styles } from './styles';

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  fullName,
  onAvatarChange,
}) => {
  const { _ } = useLingui();
  const uploadAvatarMutation = useUploadAvatar();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const processImage = async (asset: ImagePicker.ImagePickerAsset) => {
    const getMimeTypeFromUri = (uri: string): string | null => {
      const extension = uri.split('.').pop()?.toLowerCase();

      return extension ? FILE_EXTENSION_TO_MIME_TYPE[extension] || null : null;
    };
    const mimeType = getMimeTypeFromUri(asset.uri);

    if (
      !mimeType ||
      !ALLOWED_IMAGE_TYPES.includes(mimeType as (typeof ALLOWED_IMAGE_TYPES)[number])
    ) {
      setError(_(ACCOUNT_CONSTANTS.AVATAR_ERROR_INVALID_FORMAT));

      return;
    }

    if (asset.fileSize && asset.fileSize > MAX_AVATAR_SIZE) {
      setError(_(ACCOUNT_CONSTANTS.AVATAR_ERROR_TOO_LARGE));

      return;
    }

    if (!asset.base64) {
      setError(_(ACCOUNT_CONSTANTS.AVATAR_ERROR_PROCESS_FAILED));

      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const newAvatarUrl = await uploadAvatarMutation.mutateAsync({
        base64: asset.base64,
        uri: asset.uri,
        type: mimeType,
      });

      await onAvatarChange(newAvatarUrl);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : _(ACCOUNT_CONSTANTS.AVATAR_ERROR_UPDATE_FAILED);
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  const handleSelectFromLibrary = async () => {
    try {
      setError(null);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        setError(_(ACCOUNT_CONSTANTS.AVATAR_ERROR_MEDIA_LIBRARY_PERMISSION));

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

      await processImage(result.assets[0]);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : _(ACCOUNT_CONSTANTS.AVATAR_ERROR_SELECT_IMAGE_FAILED);
      setError(errorMessage);
    }
  };
  const handleTakePhoto = async () => {
    try {
      setError(null);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        setError(_(ACCOUNT_CONSTANTS.AVATAR_ERROR_CAMERA_PERMISSION));

        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      await processImage(result.assets[0]);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : _(ACCOUNT_CONSTANTS.AVATAR_ERROR_TAKE_PHOTO_FAILED);
      setError(errorMessage);
    }
  };
  const handleEditAvatar = () => {
    Alert.alert(
      _(ACCOUNT_CONSTANTS.AVATAR_SELECT_TITLE),
      _(ACCOUNT_CONSTANTS.AVATAR_SELECT_MESSAGE),
      [
        {
          text: _(ACCOUNT_CONSTANTS.AVATAR_OPTION_CAMERA),
          onPress: handleTakePhoto,
        },
        {
          text: _(ACCOUNT_CONSTANTS.AVATAR_OPTION_PHOTO_LIBRARY),
          onPress: handleSelectFromLibrary,
        },
        {
          text: _(ACCOUNT_CONSTANTS.AVATAR_OPTION_CANCEL),
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <VStack style={styles.container} alignItems="center">
      <Box style={styles.avatarWrapper}>
        <Avatar size="xl" style={styles.avatarContainer}>
          {avatarUrl && <AvatarImage source={{ uri: avatarUrl }} />}
          {!avatarUrl ? (
            <AvatarFallbackText>
              {fullName
                ? fullName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : _(ACCOUNT_CONSTANTS.AVATAR_FALLBACK_INITIAL)}
            </AvatarFallbackText>
          ) : null}
        </Avatar>
        <Pressable
          style={styles.editAvatarButton}
          onPress={handleEditAvatar}
          disabled={isUploading}
        >
          {isUploading ? (
            <Spinner size="small" />
          ) : (
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          )}
        </Pressable>
      </Box>
      {error && (
        <Text style={styles.errorText} testID="avatar-error">
          {error}
        </Text>
      )}
      <Text style={styles.userName}>
        {fullName ?? _(ACCOUNT_CONSTANTS.PROFILE_USER_PLACEHOLDER)}
      </Text>
    </VStack>
  );
};
