# Run4U Mobile (Expo + TypeScript)

결혼정보 앱 MVP를 위한 React Native(Expo) 로그인 골격입니다.

## 구현된 내용

- Google OAuth 로그인 (Expo AuthSession 기반)
- Kakao OAuth 로그인 (Expo AuthSession 기반)
- 인증 Provider 인터페이스 분리 (`SocialAuthProvider`)
- `AuthService`로 Provider 라우팅 분리
- `useSocialAuth` 훅으로 UI와 인증 로직 분리

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

EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY=
EXPO_PUBLIC_KAKAO_REDIRECT_URI=run4u://oauth/kakao
```

## 운영 적용 체크리스트

1. OAuth 결과 토큰을 백엔드(NestJS)로 전달해 서버 검증 후 세션/JWT 발급
2. Refresh token은 SecureStore 등 안전한 저장소로 관리
3. 로그인 성공 이벤트를 `outbox_event`에 적재해서 분석/알림 파이프라인 확장
4. 로그인/민감정보 접근을 `audit_log`에 저장
