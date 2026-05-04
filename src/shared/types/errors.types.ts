import { ERROR_CODES } from '@shared/constants/errors.constants';

export type ErrorCode =
  | (typeof ERROR_CODES.GENERIC)[keyof typeof ERROR_CODES.GENERIC]
  | (typeof ERROR_CODES.AUTH)[keyof typeof ERROR_CODES.AUTH]
  | (typeof ERROR_CODES.NETWORK)[keyof typeof ERROR_CODES.NETWORK]
  | (typeof ERROR_CODES.VALIDATION)[keyof typeof ERROR_CODES.VALIDATION]
  | (typeof ERROR_CODES.HOUSE)[keyof typeof ERROR_CODES.HOUSE];
