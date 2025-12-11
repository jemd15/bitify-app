import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '@lib/supabase';
import { transformSupabaseAuthError } from '@shared/utils/errorTransformers';
import { ERROR_CODES } from '@shared/constants/errors.constants';
import { DomainError } from '@shared/errors/DomainError';

import {
  AUTH_CONSTANTS,
  AUTH_PROVIDERS,
  RQKEY_SESSION,
} from '../constants/auth.constants';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'bitify',
        path: AUTH_CONSTANTS.REDIRECT_PATH,
      });
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: AUTH_PROVIDERS.GOOGLE,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (oauthError) {
        throw transformSupabaseAuthError(oauthError);
      }

      if (!data?.url) {
        throw transformSupabaseAuthError(
          new Error('Failed to get OAuth URL from Supabase'),
        );
      }

      const oauthUrlToOpen = data.url;
      const result = await WebBrowser.openAuthSessionAsync(oauthUrlToOpen, redirectUrl);

      if (result.type !== 'success' || !('url' in result) || !result.url) {
        throw new DomainError(ERROR_CODES.AUTH.GOOGLE_LOGIN_FAILED);
      }

      const hasFragment = result.url.includes('#');
      const hasAccessToken = result.url.includes('#access_token=');
      const hasCode = result.url.includes('code=');

      if (hasFragment && hasAccessToken) {
        const fragment = result.url.split('#')[1];
        const fragmentParams = new URLSearchParams(fragment);
        const accessToken = fragmentParams.get('access_token');
        const refreshToken = fragmentParams.get('refresh_token');

        if (!accessToken) {
          throw new DomainError(ERROR_CODES.AUTH.GOOGLE_LOGIN_FAILED);
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.setSession(
          {
            access_token: accessToken,
            refresh_token: refreshToken || '',
          },
        );

        if (sessionError) {
          throw transformSupabaseAuthError(sessionError);
        }

        if (!sessionData?.session) {
          throw new DomainError(ERROR_CODES.AUTH.GOOGLE_LOGIN_FAILED);
        }

        return sessionData.session;
      } else if (hasCode) {
        let authCode: string | null = null;

        try {
          const parsedUrl = Linking.parse(result.url);
          const { code, error: urlError } = parsedUrl.queryParams || {};

          if (urlError) {
            throw new DomainError(ERROR_CODES.AUTH.GOOGLE_LOGIN_FAILED);
          }

          if (code && typeof code === 'string') {
            authCode = code;
          } else {
            const codeMatch = result.url.match(/[?&]code=([^&]+)/);

            if (codeMatch && codeMatch[1]) {
              authCode = decodeURIComponent(codeMatch[1]);
            }
          }
        } catch (error) {
          const codeMatch = result.url.match(/[?&]code=([^&]+)/);

          if (codeMatch && codeMatch[1]) {
            authCode = decodeURIComponent(codeMatch[1]);
          }
        }

        if (!authCode) {
          throw new DomainError(ERROR_CODES.AUTH.GOOGLE_LOGIN_FAILED);
        }

        const { data: sessionData, error: sessionError } =
          await supabase.auth.exchangeCodeForSession(authCode);

        if (sessionError) {
          throw transformSupabaseAuthError(sessionError);
        }

        if (!sessionData?.session) {
          throw new DomainError(ERROR_CODES.AUTH.GOOGLE_LOGIN_FAILED);
        }

        return sessionData.session;
      } else {
        throw new DomainError(ERROR_CODES.AUTH.GOOGLE_LOGIN_FAILED);
      }
    },
    onSuccess: session => {
      queryClient.setQueryData(RQKEY_SESSION, session);
    },
  });
};
