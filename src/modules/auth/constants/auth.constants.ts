export const AUTH_CONSTANTS = {
  LOGIN_TITLE: 'Login',
  EMAIL_LABEL: 'Email',
  PASSWORD_LABEL: 'Password',
  LOGIN_BUTTON: 'Login',
  GOOGLE_LOGIN_BUTTON: 'Login with Google',
  FORGOT_PASSWORD: 'Forgot Password?',
} as const;

export const RQKEY_ROOT = 'auth';
export const RQKEY_SESSION = [RQKEY_ROOT, 'session'] as const;
export const GOOGLE_AUTHORIZATION_ENDPOINT =
  'https://accounts.google.com/o/oauth2/v2/auth' as const;
