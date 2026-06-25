import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme/colors';
import { font } from '@/theme/type';
import { AuthField } from '@/components/AuthField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ChevronLeft } from '@/components/Icon';
import { useAuth } from '@/auth/context';

/**
 * Two-step flow on one screen:
 *   1. Enter email → request reset code (Cognito sends it).
 *   2. Enter code + new password → reset.
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, confirmForgotPassword } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const requestCode = async () => {
    setError(null);
    setInfo(null);
    if (!email.trim()) {
      setError('Enter your email.');
      return;
    }
    setBusy(true);
    try {
      await forgotPassword(email.trim());
      setStep(2);
      setInfo('We sent a reset code to your email.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send reset code.');
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    setError(null);
    setInfo(null);
    if (!code.trim() || !password) {
      setError('Enter the code and a new password.');
      return;
    }
    setBusy(true);
    try {
      await confirmForgotPassword(email.trim(), code.trim(), password);
      setInfo('Password updated. You can now sign in.');
      setTimeout(() => router.replace('/auth/signin'), 700);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reset password.');
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

          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Enter your email and we\'ll send you a reset code.'
              : `Enter the code we sent to ${email} and choose a new password.`}
          </Text>

          <View style={{ marginTop: 24 }}>
            {step === 1 ? (
              <AuthField
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                placeholder="you@example.com"
              />
            ) : (
              <>
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
                <AuthField
                  label="New password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="new-password"
                  textContentType="newPassword"
                  placeholder="At least 8 characters"
                />
              </>
            )}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {info ? <Text style={styles.info}>{info}</Text> : null}

          <PrimaryButton
            label={
              busy
                ? step === 1
                  ? 'Sending code…'
                  : 'Resetting…'
                : step === 1
                  ? 'Send reset code'
                  : 'Reset password'
            }
            onPress={step === 1 ? requestCode : resetPassword}
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
  error: { fontFamily: font.bold, fontSize: 14, color: colors.danger, marginTop: 14, textAlign: 'center' },
  info: { fontFamily: font.bold, fontSize: 14, color: colors.accent, marginTop: 14, textAlign: 'center' },
});
