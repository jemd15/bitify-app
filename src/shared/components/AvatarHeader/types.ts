import type { UseMutationResult } from '@tanstack/react-query';

export interface UploadAvatarParams {
  base64: string;
  uri: string;
  type: string;
}

export interface ImageSelectData {
  uri: string;
  base64: string | undefined;
  type: string;
}

export interface AvatarHeaderProps {
  avatarUrl?: string;
  fullName?: string;
  onAvatarChange?: (avatarUrl: string) => Promise<void>;
  onImageSelect?: (data: ImageSelectData) => void;
  uploadAvatarMutation?: UseMutationResult<string, Error, UploadAvatarParams>;
}
