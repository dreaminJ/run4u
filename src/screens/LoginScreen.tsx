import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useSocialAuth } from '@/auth/useSocialAuth';

const SocialLoginButton = ({
  label,
  onPress,
  disabled,
  backgroundColor,
  textColor
}: {
  label: string;
  onPress: () => Promise<void>;
  disabled?: boolean;
  backgroundColor: string;
  textColor: string;
}) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      { backgroundColor, opacity: disabled || pressed ? 0.75 : 1 }
    ]}
    onPress={() => void onPress()}
    disabled={disabled}
  >
    <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
  </Pressable>
);

export const LoginScreen = () => {
  const { user, error, loadingProvider, signIn, signOut } = useSocialAuth();

  const handleGoogleLogin = async () => {
    try {
      await signIn('google');
    } catch {
      Alert.alert('Google 로그인 실패', '설정이나 네트워크를 확인해 주세요.');
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await signIn('kakao');
    } catch {
      Alert.alert('카카오 로그인 실패', '설정이나 네트워크를 확인해 주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Run4U 결혼정보</Text>
        <Text style={styles.subtitle}>안전한 매칭을 위해 소셜 로그인으로 시작하세요.</Text>

        <SocialLoginButton
          label={loadingProvider === 'google' ? 'Google 로그인 중...' : 'Google로 시작하기'}
          onPress={handleGoogleLogin}
          disabled={loadingProvider !== null}
          backgroundColor="#ffffff"
          textColor="#1f1f1f"
        />

        <SocialLoginButton
          label={loadingProvider === 'kakao' ? '카카오 로그인 중...' : '카카오로 시작하기'}
          onPress={handleKakaoLogin}
          disabled={loadingProvider !== null}
          backgroundColor="#FEE500"
          textColor="#191919"
        />

        {user ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>로그인 완료</Text>
            <Text style={styles.cardValue}>Provider: {user.provider}</Text>
            <Text style={styles.cardValue}>AccessToken: {user.accessToken.slice(0, 10)}...</Text>
            <Pressable style={styles.logoutButton} onPress={signOut}>
              <Text style={styles.logoutText}>로그아웃</Text>
            </Pressable>
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700'
  },
  subtitle: {
    color: '#B8C2E0',
    marginBottom: 12
  },
  button: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E7F2',
    paddingVertical: 14,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#111A33'
  },
  cardTitle: {
    color: '#D7E2FF',
    fontWeight: '700',
    marginBottom: 8
  },
  cardValue: {
    color: '#D7E2FF'
  },
  logoutButton: {
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  logoutText: {
    color: '#7AA2FF'
  },
  errorText: {
    color: '#FF9A9A'
  }
});
