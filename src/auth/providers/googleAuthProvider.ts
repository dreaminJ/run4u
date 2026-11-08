import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

import type { AuthUser, SocialAuthProvider } from '@/auth/types';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token'
};

const GOOGLE_SCOPES = ['openid', 'profile', 'email'];

const ensureGoogleConfig = () => {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const redirectUri =
    process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI ??
    AuthSession.makeRedirectUri({ scheme: 'run4u', path: 'oauth/google' });

  const clientId =
    Constants.platform?.ios != null
      ? iosClientId
      : Constants.platform?.android != null
        ? androidClientId
        : webClientId;

  if (!clientId) {
    throw new Error('현재 플랫폼에 맞는 Google OAuth client id 환경변수가 필요합니다.');
  }

  return { clientId, redirectUri };
};

export class GoogleAuthProvider implements SocialAuthProvider {
  provider = 'google' as const;

  async signIn(): Promise<AuthUser> {
    const { clientId, redirectUri } = ensureGoogleConfig();

    const request = new AuthSession.AuthRequest({
      clientId,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      scopes: GOOGLE_SCOPES,
      usePKCE: true
    });

    const result = await request.promptAsync(discovery);

    if (result.type !== 'success' || !result.params.code) {
      throw new Error('Google 인증 코드를 받지 못했습니다.');
    }

    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId,
        code: result.params.code,
        extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
        redirectUri
      },
      discovery
    );

    if (!tokenResponse.accessToken) {
      throw new Error('Google 토큰 발급에 실패했습니다.');
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
