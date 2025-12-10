import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transformSupabaseAuthError } from '@shared/utils/errorTransformers';
import { supabase } from '@lib/supabase';

import { RQKEY_SESSION } from '../constants/auth.constants';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw transformSupabaseAuthError(error);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(RQKEY_SESSION, null);
    },
  });
};
