import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'EMAIL_REQUIRED').email('EMAIL_INVALID'),
  password: z.string().min(1, 'PASSWORD_REQUIRED').min(6, 'PASSWORD_TOO_SHORT'),
});

export type LoginInput = z.infer<typeof loginSchema>;
