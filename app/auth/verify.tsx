import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme/colors';
import { font } from '@/theme/type';
import { AuthField } from '@/components/AuthField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ChevronLeft } from '@/components/Icon';
import { useAuth } from '@/auth/context';

export default function VerifyScreen() {
  const router = useRouter();
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const { confirmSignUp, resendCode } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setInfo(null);
    if (!email || !code.trim()) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    setBusy(true);
    try {
      await confirmSignUp(email, code.trim());
      setInfo('Email verified. You can now sign in.');
      setTimeout(() => router.replace('/auth/signin'), 600);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not verify.');
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    setError(null);
    setInfo(null);
    if (!email) return;
    try {
      await resendCode(email);
      setInfo('A new code is on its way.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not resend.');
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

          <Text style={styles.title}>Verify email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to <Text style={styles.email}>{email}</Text>. Check
            your inbox (and spam).
          </Text>

          <View style={{ marginTop: 24 }}>
            <AuthField
              label="Code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="123456"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
            />
            <Pressable onPress={onResend}>
              <Text style={styles.link}>Resend code</Text>
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {info ? <Text style={styles.info}>{info}</Text> : null}

          <PrimaryButton
            label={busy ? 'Verifying…' : 'Verify'}
            onPress={onSubmit}
            disabled={busy}
            style={{ marginTop: 20 }}
          />
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
  email: { color: colors.text },
  link: { fontFamily: font.extrabold, fontSize: 13, color: colors.accent, textAlign: 'right', marginTop: 2, marginBottom: 4 },
  error: { fontFamily: font.bold, fontSize: 14, color: colors.danger, marginTop: 14, textAlign: 'center' },
  info: { fontFamily: font.bold, fontSize: 14, color: colors.accent, marginTop: 14, textAlign: 'center' },
});
