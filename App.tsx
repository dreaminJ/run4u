import * as WebBrowser from 'expo-web-browser';

import { LoginScreen } from '@/screens/LoginScreen';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  return <LoginScreen />;
}
