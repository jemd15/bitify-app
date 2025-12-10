import { supabase } from '@lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

import { RQKEY_SESSION } from '../constants/auth.constants';

export const useAuthSession = () => {
  return useQuery<Session | null>({
    queryKey: RQKEY_SESSION,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      return data.session;
    },
    staleTime: Infinity,
    retry: false,
  });
};
