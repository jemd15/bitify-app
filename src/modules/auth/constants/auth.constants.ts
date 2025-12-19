export const AUTH_CONSTANTS = {
  LOGIN_TITLE: 'Login',
  EMAIL_LABEL: 'Email',
  PASSWORD_LABEL: 'Password',
  LOGIN_BUTTON: 'Login',
  GOOGLE_LOGIN_BUTTON: 'Login with Google',
  FORGOT_PASSWORD: 'Forgot Password?',
  REDIRECT_PATH: 'account/auth',
} as const;
export const AUTH_PROVIDERS = {
  GOOGLE: 'google',
} as const;
export const RQKEY_ROOT = 'auth';
export const RQKEY_SESSION = [RQKEY_ROOT, 'session'] as const;
