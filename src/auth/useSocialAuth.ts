import { useMemo, useState } from 'react';

import { AuthService } from '@/auth/AuthService';
import { GoogleAuthProvider } from '@/auth/providers/googleAuthProvider';
import { KakaoAuthProvider } from '@/auth/providers/kakaoAuthProvider';
import type { AuthUser, SocialProvider } from '@/auth/types';

const authService = new AuthService({
  google: new GoogleAuthProvider(),
  kakao: new KakaoAuthProvider()
});

export const useSocialAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const actions = useMemo(
    () => ({
      signIn: async (provider: SocialProvider) => {
        setLoadingProvider(provider);
        setError(null);

        try {
          const nextUser = await authService.signInWith(provider);
          setUser(nextUser);
          return nextUser;
        } catch (e) {
          const message = e instanceof Error ? e.message : '로그인 중 오류가 발생했습니다.';
          setError(message);
          throw e;
        } finally {
          setLoadingProvider(null);
        }
      },
      signOut: () => {
        setUser(null);
      }
    }),
    []
  );

  return {
    user,
    loadingProvider,
    error,
    ...actions
  };
};
