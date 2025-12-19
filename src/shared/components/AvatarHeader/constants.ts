import { msg } from '@lingui/macro';

export const AVATAR_CONSTANTS = {
  AVATAR_SELECT_TITLE: msg`Select Avatar`,
  AVATAR_SELECT_MESSAGE: msg`Choose an option`,
  AVATAR_OPTION_CAMERA: msg`Camera`,
  AVATAR_OPTION_PHOTO_LIBRARY: msg`Photo Library`,
  AVATAR_OPTION_CANCEL: msg`Cancel`,
  AVATAR_ERROR_INVALID_FORMAT: msg`Invalid image format. Please select a JPEG or PNG image.`,
  AVATAR_ERROR_TOO_LARGE: msg`Image is too large. Please select an image smaller than 5MB.`,
  AVATAR_ERROR_PROCESS_FAILED: msg`Failed to process image. Please try again.`,
  AVATAR_ERROR_UPDATE_FAILED: msg`Failed to update avatar`,
  AVATAR_ERROR_MEDIA_LIBRARY_PERMISSION: msg`Permission to access media library is required`,
  AVATAR_ERROR_SELECT_IMAGE_FAILED: msg`Failed to select image`,
  AVATAR_ERROR_CAMERA_PERMISSION: msg`Permission to access camera is required`,
  AVATAR_ERROR_TAKE_PHOTO_FAILED: msg`Failed to take photo`,
  AVATAR_FALLBACK_INITIAL: msg`U`,
  AVATAR_ACCESSIBILITY_LABEL: msg`User avatar`,
  PROFILE_USER_PLACEHOLDER: msg`User Name`,
} as const;

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
export const MIME_TYPE_JPEG = 'image/jpeg';
export const MIME_TYPE_PNG = 'image/png';
export const ALLOWED_IMAGE_TYPES = [MIME_TYPE_JPEG, 'image/jpg', MIME_TYPE_PNG] as const;
export const FILE_EXTENSION_TO_MIME_TYPE: Record<string, string> = {
  jpg: MIME_TYPE_JPEG,
  jpeg: MIME_TYPE_JPEG,
  png: MIME_TYPE_PNG,
} as const;
