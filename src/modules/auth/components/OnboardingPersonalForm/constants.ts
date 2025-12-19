import { t } from '@lingui/macro';

const errorMessages: Record<string, string> = {
  EMAIL_REQUIRED: t`Email is required`,
  EMAIL_INVALID: t`Invalid email format`,
  FULL_NAME_TOO_LONG: t`Full name must be less than 100 characters`,
  AVATAR_INVALID_FORMAT: t`Invalid image format. Please select a JPG or PNG image`,
  AVATAR_TOO_LARGE: t`Image is too large. Maximum size is 5MB`,
};
const ONBOARDING_PERSONAL_FORM_LABELS = {
  EMAIL: t`Email`,
  FULL_NAME: t`Full Name`,
  AVATAR: t`Avatar`,
  SELECT_AVATAR: t`Select Avatar`,
  CHANGE_AVATAR: t`Change Avatar`,
  UPLOADING: t`Uploading...`,
} as const;

export { errorMessages, ONBOARDING_PERSONAL_FORM_LABELS };
