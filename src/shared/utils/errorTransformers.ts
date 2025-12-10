import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { ERROR_CODES } from '@shared/constants/errors.constants';
import { DomainError } from '@shared/errors/DomainError';

export const transformSupabaseAuthError = (
  error: SupabaseAuthError | Error,
): DomainError => {
  if (!(error instanceof Error)) {
    return new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR, undefined, error);
  }

  const errorMessage = error.message.toLowerCase();
  const errorCode = (error as SupabaseAuthError).status;

  if (
    errorMessage.includes('invalid login credentials') ||
    errorMessage.includes('invalid credentials')
  ) {
    return new DomainError(ERROR_CODES.AUTH.INVALID_CREDENTIALS, undefined, error);
  }

  if (
    errorMessage.includes('email not confirmed') ||
    errorMessage.includes('email_not_confirmed')
  ) {
    return new DomainError(ERROR_CODES.AUTH.INVALID_CREDENTIALS, undefined, error);
  }

  if (errorCode === 429 || errorMessage.includes('too many requests')) {
    return new DomainError(ERROR_CODES.AUTH.TOO_MANY_REQUESTS, undefined, error);
  }

  if (
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('fetch')
  ) {
    return new DomainError(ERROR_CODES.NETWORK.CONNECTION_FAILED, undefined, error);
  }

  if (errorCode && errorCode >= 500) {
    return new DomainError(ERROR_CODES.NETWORK.SERVER_ERROR, undefined, error);
  }

  return new DomainError(ERROR_CODES.AUTH.LOGIN_FAILED, undefined, error);
};

export const transformUnknownError = (error: unknown): DomainError => {
  if (error instanceof DomainError) {
    return error;
  }

  if (error instanceof Error) {
    return new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR, error.message, error);
  }

  return new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR, undefined, error);
};
