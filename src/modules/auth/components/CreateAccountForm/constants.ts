import { t } from '@lingui/macro';

const errorMessages: Record<string, string> = {
  EMAIL_REQUIRED: t`Email is required`,
  EMAIL_INVALID: t`Invalid email format`,
  PASSWORD_REQUIRED: t`Password is required`,
  PASSWORD_TOO_SHORT: t`Password must be at least 8 characters`,
  CONFIRM_PASSWORD_REQUIRED: t`Please confirm your password`,
  PASSWORDS_DO_NOT_MATCH: t`Passwords do not match`,
};
const CREATE_ACCOUNT_FORM_LABELS = {
  EMAIL: t`Email`,
  PASSWORD: t`Password`,
  CONFIRM_PASSWORD: t`Confirm Password`,
  CREATE_ACCOUNT: t`Create Account`,
} as const;

export { errorMessages, CREATE_ACCOUNT_FORM_LABELS };
