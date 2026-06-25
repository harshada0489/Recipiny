import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme/colors';
import { font } from '@/theme/type';
import { AuthField } from '@/components/AuthField';
import { PasswordField } from '@/components/PasswordField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ChevronLeft } from '@/components/Icon';
import { useAuth } from '@/auth/context';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Live mismatch hint — only shown once the user has started typing the
  // confirmation so the field doesn't yell at them while they're still typing
  // the first password.
  const mismatch = confirmPassword.length > 0 && confirmPassword !== password;

  const onSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter an email and password.');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      await signUp(email.trim(), password);
      router.replace({ pathname: '/auth/verify', params: { email: email.trim() } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign up.');
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
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft />
          </Pressable>

          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Your recipes stay on this device. The account is only for sign-in.
          </Text>

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
              autoComplete="new-password"
              textContentType="newPassword"
              placeholder="At least 8 characters"
              showStrength
            />
            <PasswordField
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoComplete="new-password"
              textContentType="newPassword"
              placeholder="Re-enter password"
              helper={mismatch ? "Passwords don't match" : null}
              helperColor={mismatch ? colors.danger : undefined}
            />
            <Text style={styles.help}>
              8+ characters with an uppercase letter, a lowercase letter, a number and a symbol.
            </Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            label={busy ? 'Creating account…' : 'Sign up'}
            onPress={onSubmit}
            disabled={busy}
            style={{ marginTop: 20 }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.replace('/auth/signin')}>
              <Text style={styles.footerLink}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.screenH, paddingTop: 8, paddingBottom: 40 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginBottom: 12, marginLeft: -8 },
  title: { fontFamily: font.black, fontSize: 34, color: colors.text, letterSpacing: -1, marginTop: 4 },
  subtitle: { fontFamily: font.bold, fontSize: 15, color: colors.dim, marginTop: 6, lineHeight: 21 },
  help: { fontFamily: font.semibold, fontSize: 12, color: colors.dim, marginLeft: 4, marginBottom: 4 },
  error: { fontFamily: font.bold, fontSize: 14, color: colors.danger, marginTop: 14, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { fontFamily: font.semibold, fontSize: 14, color: colors.dim },
  footerLink: { fontFamily: font.extrabold, fontSize: 14, color: colors.accent },
});
