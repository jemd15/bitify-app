import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { ZodError } from 'zod';
import { ERROR_CODES } from '@shared/constants/errors.constants';
import { DomainError } from '@shared/errors/DomainError';
import { logger } from '@shared/logger';

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

  logger.warn('Supabase auth error', { error });

  return new DomainError(ERROR_CODES.AUTH.LOGIN_FAILED, undefined, error);
};

export const transformSupabaseError = (error: Error | SupabaseAuthError): DomainError => {
  if (!(error instanceof Error)) {
    return new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR, undefined, error);
  }

  const errorMessage = error.message.toLowerCase();
  const errorCode = (error as SupabaseAuthError).status;

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

  logger.warn('Supabase error', { error });

  return new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR, undefined, error);
};

export const transformZodError = (error: ZodError): DomainError => {
  const firstError = error.errors[0];

  if (firstError.code === 'invalid_type') {
    return new DomainError(
      ERROR_CODES.VALIDATION.INVALID_FORMAT,
      firstError.message,
      error,
    );
  }

  if (firstError.code === 'too_small' || firstError.code === 'too_big') {
    return new DomainError(
      ERROR_CODES.VALIDATION.INVALID_INPUT,
      firstError.message,
      error,
    );
  }

  return new DomainError(ERROR_CODES.VALIDATION.INVALID_INPUT, firstError.message, error);
};

export const transformUnknownError = (error: unknown): DomainError => {
  if (error instanceof DomainError) {
    return error;
  }

  if (error instanceof ZodError) {
    return transformZodError(error);
  }

  if (error instanceof Error) {
    if (
      'status' in error ||
      error.message.includes('supabase') ||
      error.message.includes('auth')
    ) {
      return transformSupabaseError(error);
    }

    return new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR, error.message, error);
  }

  return new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR, undefined, error);
};
