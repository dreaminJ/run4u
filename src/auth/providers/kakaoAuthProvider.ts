import * as AuthSession from 'expo-auth-session';

import type { AuthUser, SocialAuthProvider } from '@/auth/types';

const KAKAO_AUTH_ENDPOINT = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_TOKEN_ENDPOINT = 'https://kauth.kakao.com/oauth/token';
const KAKAO_SCOPES = ['profile_nickname,account_email'];

const ensureKakaoConfig = () => {
  const restApiKey = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;
  const redirectUri =
    process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI ??
    AuthSession.makeRedirectUri({ scheme: 'run4u', path: 'oauth/kakao' });

  if (!restApiKey) {
    throw new Error('Kakao OAuth 환경변수(EXPO_PUBLIC_KAKAO_REST_API_KEY)가 필요합니다.');
  }

  return { restApiKey, redirectUri };
};

export class KakaoAuthProvider implements SocialAuthProvider {
  provider = 'kakao' as const;

  async signIn(): Promise<AuthUser> {
    const { restApiKey, redirectUri } = ensureKakaoConfig();

    const request = new AuthSession.AuthRequest({
      clientId: restApiKey,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      scopes: KAKAO_SCOPES,
      usePKCE: true
    });

    const result = await request.promptAsync({
      authorizationEndpoint: KAKAO_AUTH_ENDPOINT
    });

    if (result.type !== 'success' || !result.params.code) {
      throw new Error('카카오 인증 코드를 받지 못했습니다.');
    }

    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId: restApiKey,
        code: result.params.code,
        extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
        redirectUri
      },
      {
        tokenEndpoint: KAKAO_TOKEN_ENDPOINT
      }
    );

    if (!tokenResponse.accessToken) {
      throw new Error('카카오 토큰 발급에 실패했습니다.');
    }

    return {
      provider: this.provider,
      accessToken: tokenResponse.accessToken,
      idToken: tokenResponse.idToken,
      refreshToken: tokenResponse.refreshToken,
      expiresIn: tokenResponse.expiresIn
    };
  }
}
