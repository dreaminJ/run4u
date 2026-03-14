import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

import type { AuthUser, SocialAuthProvider } from '@/auth/types';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token'
};

const ensureGoogleConfig = () => {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  if (!iosClientId || !androidClientId || !webClientId) {
    throw new Error('Google OAuth 환경변수(EXPO_PUBLIC_GOOGLE_*_CLIENT_ID)가 필요합니다.');
  }

  return { iosClientId, androidClientId, webClientId };
};

export class GoogleAuthProvider implements SocialAuthProvider {
  provider = 'google' as const;

  async signIn(): Promise<AuthUser> {
    const { iosClientId, androidClientId, webClientId } = ensureGoogleConfig();
    const redirectUri = AuthSession.makeRedirectUri({ scheme: 'run4u' });

    const request = new AuthSession.AuthRequest({
      clientId:
        Constants.platform?.ios != null
          ? iosClientId
          : Constants.platform?.android != null
            ? androidClientId
            : webClientId,
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
      scopes: ['openid', 'profile', 'email']
    });

    const result = await request.promptAsync(discovery);

    if (result.type !== 'success' || !result.params.access_token) {
      throw new Error('Google 로그인에 실패했어요.');
    }

    return {
      provider: this.provider,
      accessToken: result.params.access_token,
      idToken: result.params.id_token,
      expiresIn: result.params.expires_in ? Number(result.params.expires_in) : undefined
    };
  }
}
