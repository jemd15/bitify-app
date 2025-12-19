import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@lib/supabase';
import { useAuthSession } from '@modules/auth/hooks/useAuthSession';
import { logger } from '@shared/logger';

import { RQKEY_PROFILE } from './useProfile';
import type { UpdateProfileParams, Profile } from '../types/account.types';

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

export const useUpdateProfile = () => {
  const { data: session } = useAuthSession();
  const queryClient = useQueryClient();

  return useMutation<Profile, Error, UpdateProfileParams>({
    mutationFn: async params => {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      if (!session?.user?.email) {
        throw new Error('User email not available');
      }

      const updateData: any = {
        id: session.user.id,
        email: session.user.email,
      };

      if (params.fullName !== undefined) {
        updateData.full_name = params.fullName;
      }

      if (params.avatarUrl !== undefined) {
        updateData.avatar_url = params.avatarUrl;
      }

      if (params.userType !== undefined) {
        updateData.user_type = params.userType;
      }

      const { data, error } = await supabase
        .from('users')
        .upsert(updateData, {
          onConflict: 'id',
        })
        .select()
        .single();

      if (error) {
        logger.error(error);
        throw error;
      }

      return mapProfileFromDb(data);
    },
    onSuccess: data => {
      queryClient.setQueryData(RQKEY_PROFILE, data);
    },
    onError: error => {
      logger.error(error);
    },
  });
};
