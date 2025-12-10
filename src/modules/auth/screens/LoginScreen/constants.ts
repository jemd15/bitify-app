import { t } from '@lingui/macro';

const LOGIN_LABELS = {
  TITLE: t`Welcome Back`,
  SUBTITLE: t`Login to your account to continue`,
  OR: t`or`,
  NO_ACCOUNT: t`Don't have an account?`,
  CREATE_ACCOUNT: t`Create Account`,
} as const;

export default LOGIN_LABELS;
