import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.string().min(1, 'EMAIL_REQUIRED').email('EMAIL_INVALID'),
    password: z
      .string()
      .min(1, 'PASSWORD_REQUIRED')
      .min(6, 'PASSWORD_TOO_SHORT')
      .refine(password => /[a-z]/.test(password), {
        message: 'PASSWORD_MISSING_LOWERCASE',
      })
      .refine(password => /[A-Z]/.test(password), {
        message: 'PASSWORD_MISSING_UPPERCASE',
      })
      .refine(password => /\d/.test(password), { message: 'PASSWORD_MISSING_DIGIT' })
      .refine(password => /[@$!%*?&=+^ñáéíóúüÑÁÉÍÓÚÜ#]/.test(password), {
        message: 'PASSWORD_MISSING_SPECIAL_CHAR',
      }),
    confirmPassword: z.string().min(1, 'CONFIRM_PASSWORD_REQUIRED'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'PASSWORDS_DO_NOT_MATCH',
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signupSchema>;
