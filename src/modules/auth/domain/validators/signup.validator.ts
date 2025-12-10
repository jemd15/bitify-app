import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.string().min(1, 'EMAIL_REQUIRED').email('EMAIL_INVALID'),
    password: z
      .string()
      .min(1, 'PASSWORD_REQUIRED')
      .min(6, 'PASSWORD_TOO_SHORT')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'PASSWORD_WEAK',
      ),
    confirmPassword: z.string().min(1, 'CONFIRM_PASSWORD_REQUIRED'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'PASSWORDS_DO_NOT_MATCH',
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signupSchema>;
