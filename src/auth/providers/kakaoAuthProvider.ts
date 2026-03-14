import * as AuthSession from 'expo-auth-session';

import type { AuthUser, SocialAuthProvider } from '@/auth/types';

const KAKAO_AUTH_ENDPOINT = 'https://kauth.kakao.com/oauth/authorize';

const ensureKakaoConfig = () => {
  const nativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
  const redirectUri =
    process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI ??
    AuthSession.makeRedirectUri({ scheme: 'run4u', path: 'oauth/kakao' });

  if (!nativeAppKey) {
    throw new Error('Kakao OAuth 환경변수(EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY)가 필요합니다.');
  }

  return { nativeAppKey, redirectUri };
};

export class KakaoAuthProvider implements SocialAuthProvider {
  provider = 'kakao' as const;

  async signIn(): Promise<AuthUser> {
    const { nativeAppKey, redirectUri } = ensureKakaoConfig();

    const request = new AuthSession.AuthRequest({
      clientId: nativeAppKey,
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
      scopes: ['profile_nickname', 'account_email']
    });

    const result = await request.promptAsync({
      authorizationEndpoint: KAKAO_AUTH_ENDPOINT
    });

    if (result.type !== 'success' || !result.params.access_token) {
      throw new Error('카카오 로그인에 실패했어요.');
    }

    return {
      provider: this.provider,
      accessToken: result.params.access_token,
      expiresIn: result.params.expires_in ? Number(result.params.expires_in) : undefined
    };
  }
}
