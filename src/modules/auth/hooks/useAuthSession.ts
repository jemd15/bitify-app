import { supabase } from '@lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { RQKEY_SESSION } from '../constants/auth.constants';

export const useAuthSession = () => {
  const queryClient = useQueryClient();

  return useQuery<Session | null>({
    queryKey: RQKEY_SESSION,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return data.session;
    },
    initialData: () => {
      const cached = queryClient.getQueryData<Session | null>(RQKEY_SESSION);

      return cached ?? undefined;
    },
    placeholderData: () => {
      return queryClient.getQueryData<Session | null>(RQKEY_SESSION) ?? undefined;
    },
    staleTime: Infinity,
    retry: false,
  });
};
