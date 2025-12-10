import { supabase } from '@lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logger } from '@shared/logger';
import { Session } from '@supabase/supabase-js';
import { transformSupabaseAuthError } from '@shared/utils/errorTransformers';
import { ERROR_CODES } from '@shared/constants/errors.constants';

import { RQKEY_SESSION } from '../constants/auth.constants';
import { LoginInput } from '../types/auth.types';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<Session, Error, LoginInput>({
    mutationFn: async (input: LoginInput) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw transformSupabaseAuthError(error);
      }

      if (!data.user) {
        throw new Error(ERROR_CODES.AUTH.LOGIN_FAILED);
      }

      return data.session;
    },
    onSuccess: session => {
      queryClient.setQueryData(RQKEY_SESSION, session);
    },
    onError: error => {
      logger.error(error);
    },
  });
};
