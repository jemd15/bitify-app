export type LoginInput = {
  email: string;
  password: string;
};

export type GoogleLoginParams = {
  redirectUrl: string;
};

export type AuthError = {
  code: string;
  message: string;
};
