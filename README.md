# Run4U Mobile (Expo + TypeScript)

결혼정보 앱 MVP를 위한 React Native(Expo) 로그인 골격입니다.

## 구현된 내용

- Google OAuth 로그인 (Expo AuthSession authorization code + PKCE 기반)
- Kakao OAuth 로그인 (Expo AuthSession authorization code 기반)
- 인증 Provider 인터페이스 분리 (`SocialAuthProvider`)
- `AuthService`로 Provider 라우팅 분리
- `useSocialAuth` 훅으로 UI와 인증 로직 분리
- 앱 진입점에서 AuthSession 브라우저 완료 처리 (`WebBrowser.maybeCompleteAuthSession()`)

## 폴더 구조

```text
src/
  auth/
    providers/
      googleAuthProvider.ts
      kakaoAuthProvider.ts
    AuthService.ts
    types.ts
    useSocialAuth.ts
  screens/
    LoginScreen.tsx
```

## 실행

```bash
pnpm install
cp .env.example .env
pnpm start
```

## 환경변수

`.env`:

```bash
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_REDIRECT_URI=run4u://oauth/google

EXPO_PUBLIC_KAKAO_REST_API_KEY=
EXPO_PUBLIC_KAKAO_REDIRECT_URI=run4u://oauth/kakao
```

Google 로그인은 현재 플랫폼에 맞는 client id만 검사합니다. `EXPO_PUBLIC_GOOGLE_REDIRECT_URI`는 Google Cloud Console에 등록한 redirect URI와 정확히 일치해야 합니다. 기본값을 쓰려면 Google Cloud에 `run4u://oauth/google`을 등록하세요. 운영에서 Google이 reverse-DNS 형태의 커스텀 스킴을 요구하는 구성이라면 `app.json`의 `scheme`과 이 환경변수를 같은 값으로 맞춰야 합니다.

Kakao 로그인은 Kakao Developers의 REST API 키를 사용합니다. Client secret을 켜둔 운영 구성에서는 secret을 앱에 넣지 말고, 인증 코드 토큰 교환을 백엔드에서 처리하세요.

## 운영 적용 체크리스트

1. OAuth 결과 토큰을 백엔드(NestJS)로 전달해 서버 검증 후 세션/JWT 발급
2. Refresh token은 SecureStore 등 안전한 저장소로 관리
3. 로그인 성공 이벤트를 `outbox_event`에 적재해 분석/알림 파이프라인으로 확장
4. 로그인 민감정보 접근은 `audit_log`에 기록
