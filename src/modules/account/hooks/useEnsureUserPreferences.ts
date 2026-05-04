import { useCallback } from 'react';

import { useUpdateUserPreferences } from './useUpdateUserPreferences';

export const useEnsureUserPreferences = () => {
  const { mutateAsync: updatePreferences } = useUpdateUserPreferences();
  const ensurePreferences = useCallback(async () => {
    await updatePreferences({});
  }, [updatePreferences]);

  return { ensurePreferences };
};
