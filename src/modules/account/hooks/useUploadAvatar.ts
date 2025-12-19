import { useMutation } from '@tanstack/react-query';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@lib/supabase';
import { useAuthSession } from '@modules/auth/hooks/useAuthSession';
import { logger } from '@shared/logger';

import {
  STORAGE_BUCKET_USER_FILES,
  AVATAR_FILE_PREFIX,
  AVATAR_DEFAULT_EXTENSION,
  AVATAR_LIST_LIMIT,
  AVATAR_LIST_OFFSET,
  ERROR_MESSAGE_USER_NOT_AUTHENTICATED,
} from '../constants/account.constants';

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
        throw new Error(ERROR_MESSAGE_USER_NOT_AUTHENTICATED);
      }

      const fileExt = uri.split('.').pop() || AVATAR_DEFAULT_EXTENSION;
      const filePath = `${session.user.id}/${AVATAR_FILE_PREFIX}${fileExt}`;
      const arrayBuffer = decode(base64);
      const { data: existingFiles } = await supabase.storage
        .from(STORAGE_BUCKET_USER_FILES)
        .list(session.user.id, {
          limit: AVATAR_LIST_LIMIT,
          offset: AVATAR_LIST_OFFSET,
        });

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles
          .filter(file => file.name.startsWith(AVATAR_FILE_PREFIX))
          .map(file => `${session.user.id}/${file.name}`);

        if (filesToDelete.length > 0) {
          await supabase.storage.from(STORAGE_BUCKET_USER_FILES).remove(filesToDelete);
        }
      }

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET_USER_FILES)
        .upload(filePath, arrayBuffer, {
          contentType: type,
          upsert: true,
        });

      if (error) {
        logger.error(error);
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKET_USER_FILES).getPublicUrl(data.path);

      return publicUrl;
    },
    onError: error => {
      logger.error(error);
    },
  });
};
