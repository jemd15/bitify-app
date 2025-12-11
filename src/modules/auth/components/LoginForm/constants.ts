import { t } from '@lingui/macro';

const errorMessages: Record<string, string> = {
  EMAIL_REQUIRED: t`Email is required`,
  EMAIL_INVALID: t`Invalid email format`,
  PASSWORD_REQUIRED: t`Password is required`,
  PASSWORD_TOO_SHORT: t`Password must be at least 6 characters`,
  PASSWORD_MISSING_LOWERCASE: t`Password must contain at least one lowercase letter`,
  PASSWORD_MISSING_UPPERCASE: t`Password must contain at least one uppercase letter`,
  PASSWORD_MISSING_DIGIT: t`Password must contain at least one digit`,
  PASSWORD_MISSING_SPECIAL_CHAR: t`Password must contain at least one special character`,
};
const LOGIN_FORM_LABELS = {
  EMAIL: t`Email`,
  PASSWORD: t`Password`,
  LOGIN: t`Login`,
  FORGOT_PASSWORD: t`Forgot Password?`,
} as const;

export { errorMessages, LOGIN_FORM_LABELS };
