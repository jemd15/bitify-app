import { msg } from '@lingui/macro';

export const PROFILE_CONSTANTS = {
  PROFILE_TITLE: msg`My Account`,
  PROFILE_USER_PLACEHOLDER: msg`User Name`,
} as const;

export const MENU_ITEM_CONSTANTS = {
  MENU_ITEM_PRO_PLAN_TITLE: msg`Pro Plan`,
  MENU_ITEM_PRO_PLAN_DESCRIPTION: msg`Unlock exclusive benefits and premium features`,
  MENU_ITEM_THEME_TITLE: msg`Theme`,
  MENU_ITEM_THEME_DESCRIPTION: msg`Choose your preferred appearance`,
  MENU_ITEM_LANGUAGE_TITLE: msg`Language`,
  MENU_ITEM_LANGUAGE_DESCRIPTION: msg`Select your preferred language`,
  MENU_ITEM_NOTIFICATIONS_TITLE: msg`Notifications`,
  MENU_ITEM_NOTIFICATIONS_DESCRIPTION: msg`Enable or disable notifications`,
  MENU_ITEM_LOGOUT_TITLE: msg`Logout`,
} as const;

export const SETTINGS_CONSTANTS = {
  SETTINGS_TITLE: msg`Settings`,
  AUTH_TITLE: msg`Authentication`,
} as const;

export const THEME_CONSTANTS = {
  THEME_LIGHT: msg`Light`,
  THEME_DARK: msg`Dark`,
  THEME_AUTO: msg`Auto`,
} as const;

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
} as const;

export const LANGUAGE_CONSTANTS = {
  LANGUAGE_DEFAULT_FALLBACK: msg`English`,
} as const;

export const ACCOUNT_CONSTANTS = {
  ...PROFILE_CONSTANTS,
  ...MENU_ITEM_CONSTANTS,
  ...SETTINGS_CONSTANTS,
  ...THEME_CONSTANTS,
  ...AVATAR_CONSTANTS,
  ...LANGUAGE_CONSTANTS,
} as const;

export const THEME_VALUE_LIGHT = 'light' as const;
export const THEME_VALUE_DARK = 'dark' as const;
export const THEME_VALUE_AUTO = 'auto' as const;

export const LANGUAGE_VALUE_ES = 'es' as const;
export const LANGUAGE_VALUE_EN = 'en' as const;

export const STORAGE_KEY_PREFERENCES = 'preferences' as const;
export const STORAGE_KEY_APP_LANGUAGE = 'appLanguage' as const;

export const DEFAULT_NOTIFICATIONS_ENABLED = true as const;

export const ERROR_MESSAGE_USER_NOT_AUTHENTICATED = 'User not authenticated' as const;

export const DB_TABLE_USER_PREFERENCES = 'user_preferences' as const;
export const DB_FIELD_THEME = 'theme' as const;
export const DB_FIELD_LANGUAGE = 'language' as const;
export const DB_FIELD_NOTIFICATIONS_ENABLED = 'notifications_enabled' as const;
export const DB_FIELD_NOTIFICATIONS_TASK_REMINDER_ENABLED =
  'notifications_task_reminder_enabled' as const;
export const DB_FIELD_NOTIFICATIONS_TASK_VALIDATION_ENABLED =
  'notifications_task_validation_enabled' as const;
export const DB_FIELD_NOTIFICATIONS_MEMBER_JOINED_ENABLED =
  'notifications_member_joined_enabled' as const;
export const DB_FIELD_NOTIFICATIONS_MEMBER_LEFT_ENABLED =
  'notifications_member_left_enabled' as const;
export const DB_FIELD_USER_ID = 'user_id' as const;

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
export const MIME_TYPE_JPEG = 'image/jpeg';
export const MIME_TYPE_PNG = 'image/png';
export const ALLOWED_IMAGE_TYPES = [MIME_TYPE_JPEG, 'image/jpg', MIME_TYPE_PNG] as const;
export const FILE_EXTENSION_TO_MIME_TYPE: Record<string, string> = {
  jpg: MIME_TYPE_JPEG,
  jpeg: MIME_TYPE_JPEG,
  png: MIME_TYPE_PNG,
} as const;

export const STORAGE_BUCKET_USER_FILES = 'user_files' as const;
export const AVATAR_FILE_PREFIX = 'avatar.' as const;
export const AVATAR_DEFAULT_EXTENSION = 'jpg' as const;
export const AVATAR_LIST_LIMIT = 100 as const;
export const AVATAR_LIST_OFFSET = 0 as const;
