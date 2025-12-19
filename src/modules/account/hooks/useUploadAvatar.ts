import { useMutation } from '@tanstack/react-query';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@lib/supabase';
import { useAuthSession } from '@modules/auth/hooks/useAuthSession';
import { logger } from '@shared/logger';

export interface UploadAvatarParams {
  base64: string;
  uri: string;
  type: string;
}

export const useUploadAvatar = () => {
  const { data: session } = useAuthSession();

  return useMutation<string, Error, UploadAvatarParams>({
    mutationFn: async ({ base64, uri, type }) => {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;
      const arrayBuffer = decode(base64);
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: type,
          upsert: false,
        });

      if (error) {
        logger.error(error);
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(data.path);

      return publicUrl;
    },
    onError: error => {
      logger.error(error);
    },
  });
};
