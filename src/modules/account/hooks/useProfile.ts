import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@lib/supabase';
import { useAuthSession } from '@modules/auth/hooks/useAuthSession';

import type { Profile } from '../types/account.types';

export const RQKEY_ROOT = 'account';
export const RQKEY_PROFILE = [RQKEY_ROOT, 'profile'] as const;

const mapProfileFromDb = (data: any): Profile => {
  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    avatarUrl: data.avatar_url,
    userType: data.user_type,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

export const useProfile = () => {
  const { data: session } = useAuthSession();
  const queryClient = useQueryClient();

  return useQuery<Profile | null>({
    queryKey: RQKEY_PROFILE,
    queryFn: async () => {
      if (!session?.user?.id) {
        return null;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      return mapProfileFromDb(data);
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    retry: false,
    initialData: () => {
      const cached = queryClient.getQueryData<Profile | null>(RQKEY_PROFILE);

      return cached ?? undefined;
    },
    placeholderData: () => {
      return queryClient.getQueryData<Profile | null>(RQKEY_PROFILE) ?? undefined;
    },
  });
};
