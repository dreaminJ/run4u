import type { AuthUser, SocialAuthProvider, SocialProvider } from '@/auth/types';

export class AuthService {
  constructor(private readonly providers: Record<SocialProvider, SocialAuthProvider>) {}

  async signInWith(provider: SocialProvider): Promise<AuthUser> {
    return this.providers[provider].signIn();
  }
}
