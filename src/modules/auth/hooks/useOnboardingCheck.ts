import { useMemo } from 'react';
import { useProfile } from '@modules/account/hooks/useProfile';

import { useAuthSession } from './useAuthSession';

export const useOnboardingCheck = () => {
  const { data: session, isLoading: isLoadingSession } = useAuthSession();
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const needsOnboarding = useMemo(() => {
    if (isLoadingSession || isLoadingProfile) {
      return undefined;
    }

    if (!session?.user?.id) {
      return false;
    }

    if (!profile) {
      return true;
    }

    if (!profile.fullName) {
      return true;
    }

    return false;
  }, [session, profile, isLoadingSession, isLoadingProfile]);

  return {
    data: needsOnboarding,
    isLoading: isLoadingSession || isLoadingProfile,
  };
};
