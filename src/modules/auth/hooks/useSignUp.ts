import { supabase } from '@lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logger } from '@shared/logger';
import { Session } from '@supabase/supabase-js';
import { transformSupabaseAuthError } from '@shared/utils/errorTransformers';
import { ERROR_CODES } from '@shared/constants/errors.constants';

import { RQKEY_SESSION } from '../constants/auth.constants';
import { SignUpInput } from '../domain/validators/signup.validator';

export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation<Session | null, Error, SignUpInput>({
    mutationFn: async (input: SignUpInput) => {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw transformSupabaseAuthError(error);
      }

      if (!data.user) {
        throw new Error(ERROR_CODES.AUTH.SIGNUP_FAILED);
      }

      return data.session;
    },
    onSuccess: session => {
      if (session) {
        queryClient.setQueryData(RQKEY_SESSION, session);
      }
    },
    onError: error => {
      logger.error(error);
    },
  });
};
