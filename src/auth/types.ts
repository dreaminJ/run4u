export type SocialProvider = 'google' | 'kakao';

export type AuthUser = {
  provider: SocialProvider;
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
  expiresIn?: number;
};

export interface SocialAuthProvider {
  provider: SocialProvider;
  signIn(): Promise<AuthUser>;
}
