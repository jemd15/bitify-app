import { ErrorCode } from '@shared/types/errors.types';

export class DomainError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message?: string,
    public readonly originalError?: unknown,
  ) {
    super(message || code);
    this.name = 'DomainError';

    if (originalError instanceof Error) {
      this.stack = originalError.stack;
    }
  }
}
