import { t } from '@lingui/macro';

const errorMessages: Record<string, string> = {
  EMAIL_REQUIRED: t`Email is required`,
  EMAIL_INVALID: t`Invalid email format`,
  PASSWORD_REQUIRED: t`Password is required`,
  PASSWORD_TOO_SHORT: t`Password must be at least 8 characters`,
};
const LOGIN_FORM_LABELS = {
  EMAIL: t`Email`,
  PASSWORD: t`Password`,
  LOGIN: t`Login`,
  FORGOT_PASSWORD: t`Forgot Password?`,
} as const;

export { errorMessages, LOGIN_FORM_LABELS };
