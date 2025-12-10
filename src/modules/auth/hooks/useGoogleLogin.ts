import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { supabase } from '@lib/supabase';
import { transformSupabaseAuthError } from '@shared/utils/errorTransformers';
import { ERROR_CODES } from '@shared/constants/errors.constants';
import { DomainError } from '@shared/errors/DomainError';

import {
  GOOGLE_AUTHORIZATION_ENDPOINT,
  RQKEY_SESSION,
} from '../constants/auth.constants';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const codeVerifier = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString(),
      );
      const codeChallenge = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        codeVerifier,
      );
      const redirectUrl = AuthSession.makeRedirectUri();
      const request = new AuthSession.AuthRequest({
        responseType: AuthSession.ResponseType.Code,
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
        redirectUri: redirectUrl,
        scopes: ['openid', 'profile', 'email'],
        codeChallenge,
        codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      });
      const result = await request.promptAsync({
        authorizationEndpoint: GOOGLE_AUTHORIZATION_ENDPOINT,
      });

      if (result.type !== 'success' || !result.params.code) {
        throw new DomainError(ERROR_CODES.AUTH.GOOGLE_LOGIN_FAILED);
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            code: result.params.code,
            code_verifier: codeVerifier,
          },
        },
      });

      if (error) {
        throw transformSupabaseAuthError(error);
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw transformSupabaseAuthError(sessionError);
      }

      if (!sessionData.session) {
        throw new DomainError(ERROR_CODES.AUTH.GOOGLE_LOGIN_FAILED);
      }

      return sessionData.session;
    },
    onSuccess: session => {
      queryClient.setQueryData(RQKEY_SESSION, session);
    },
  });
};
