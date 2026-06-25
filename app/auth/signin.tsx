import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme/colors';
import { font } from '@/theme/type';
import { AuthField } from '@/components/AuthField';
import { PasswordField } from '@/components/PasswordField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/auth/context';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      // The AuthGate watches the auth state and redirects to the main app
      // automatically once `user` is set — no router call needed here.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.brand}>Recipiny<Text style={styles.brandDot}>.</Text></Text>

          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Welcome back.</Text>

          <View style={{ marginTop: 24 }}>
            <AuthField
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              placeholder="you@example.com"
            />
            <PasswordField
              label="Password"
              value={password}
              onChangeText={setPassword}
              autoComplete="current-password"
              textContentType="password"
              placeholder="••••••••"
            />

            <Pressable onPress={() => router.push('/auth/forgot')}>
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            label={busy ? 'Signing in…' : 'Sign in'}
            onPress={onSubmit}
            disabled={busy}
            style={{ marginTop: 20 }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.replace('/auth/signup')}>
              <Text style={styles.footerLink}>Sign up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.screenH, paddingTop: 24, paddingBottom: 40 },
  brand: { fontFamily: font.black, fontSize: 22, color: colors.text, letterSpacing: -0.6, marginBottom: 60 },
  brandDot: { color: colors.accent },
  title: { fontFamily: font.black, fontSize: 34, color: colors.text, letterSpacing: -1, marginTop: 4 },
  subtitle: { fontFamily: font.bold, fontSize: 15, color: colors.dim, marginTop: 6 },
  link: { fontFamily: font.extrabold, fontSize: 13, color: colors.accent, textAlign: 'right', marginTop: 2, marginBottom: 4 },
  error: { fontFamily: font.bold, fontSize: 14, color: colors.danger, marginTop: 14, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { fontFamily: font.semibold, fontSize: 14, color: colors.dim },
  footerLink: { fontFamily: font.extrabold, fontSize: 14, color: colors.accent },
});
