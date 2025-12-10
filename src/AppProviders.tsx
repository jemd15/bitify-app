import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@lib/queryClient';
import { I18nProvider } from '@locale/i18nProvider';
import { supabase } from '@lib/supabase';
import { RQKEY_SESSION } from '@modules/auth/constants/auth.constants';
import { logger } from '@shared/logger';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        queryClient.setQueryData(RQKEY_SESSION, session);
      } catch (error) {
        logger.error(error as Error);
        queryClient.setQueryData(RQKEY_SESSION, null);
      }
    };

    fetchSession();
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {children}
        {process.env.EXPO_PUBLIC_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </I18nProvider>
    </QueryClientProvider>
  );
};
