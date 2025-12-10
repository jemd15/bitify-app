import { createClient } from '@supabase/supabase-js';
import { RQKEY_SESSION } from '@modules/auth/constants/auth.constants';

import { queryClient } from './queryClient';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

supabase.auth.onAuthStateChange((event, session) => {
  queryClient.setQueryData(RQKEY_SESSION, session);

  if (event === 'SIGNED_OUT') {
    queryClient.clear();
  }
});
