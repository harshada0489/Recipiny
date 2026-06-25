import React, { useCallback, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import Constants from 'expo-constants';

import { colors, radius, spacing } from '@/theme/colors';
import { font } from '@/theme/type';
import { ChevronRight, DownloadIcon, UploadIcon } from '@/components/Icon';
import { countRecipes } from '@/db/recipes';
import { exportBackup, importBackup } from '@/db/backup';
import { useAuth } from '@/auth/context';

const SUPPORT_EMAIL = 'mycreativelab26@gmail.com';

type SettingRow = { key: string; label: string; onPress: () => void };

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [recipeCount, setRecipeCount] = useState(0);
  const [busy, setBusy] = useState<null | 'backup' | 'restore' | 'signout'>(null);

  const reload = useCallback(() => {
    countRecipes().then(setRecipeCount).catch((e) => console.warn(e));
  }, []);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const onAccount = () => {
    Alert.alert(
      'Account',
      `Recipiny is local-first — your recipes live only on this device, never on a server.\n\nYou have ${recipeCount} saved recipe${recipeCount === 1 ? '' : 's'}. To move them between devices, use "Back up my recipes" above.`,
    );
  };

  const onNotifications = () => {
    Alert.alert(
      'Notifications',
      'Recipiny doesn\'t send any notifications right now. Cook-day reminders and weekly meal-plan nudges are on the roadmap.',
    );
  };

  const onAppearance = () => {
    Alert.alert(
      'Appearance',
      'Recipiny uses a single dark theme by design. Light mode and accent-color choices may come in a future release.',
    );
  };

  const onHelp = async () => {
    const subject = encodeURIComponent('Recipiny feedback');
    const body = encodeURIComponent(
      `\n\n---\nApp version: ${appVersion}\nSaved recipes: ${recipeCount}`,
    );
    const url = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(
          'No mail app',
          `Please email feedback to ${SUPPORT_EMAIL}`,
        );
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert('Could not open mail', `Please email feedback to ${SUPPORT_EMAIL}`);
    }
  };

  const onLogout = () => {
    if (!user || busy === 'signout') return;

    Alert.alert('Log out?', `Sign out of ${user.email}? Your recipes stay on this device.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          setBusy('signout');
          try {
            await signOut();
            // AuthGate will pick up the new (null) user and redirect on its
            // own, but doing an explicit replace makes the transition feel
            // immediate even if the state effect takes a tick to fire.
            router.replace('/auth/signin');
          } catch (e) {
            Alert.alert('Could not log out', e instanceof Error ? e.message : 'Unknown error');
          } finally {
            setBusy(null);
          }
        },
      },
    ]);
  };

  const initial = (user?.email ?? 'A').charAt(0).toUpperCase();
  const displayName = user?.email ?? 'Signed out';
  const displayEmail = user ? 'Signed in' : '';

  const SETTINGS: SettingRow[] = [
    { key: 'a', label: 'Account', onPress: onAccount },
    { key: 'n', label: 'Notifications', onPress: onNotifications },
    { key: 'p', label: 'Appearance', onPress: onAppearance },
    { key: 'h', label: 'Help & feedback', onPress: onHelp },
  ];

  const onBackup = async () => {
    if (busy) return;
    setBusy('backup');
    try {
      const res = await exportBackup();
      if (!res.shared) {
        Alert.alert('Backup saved', `Saved to:\n${res.uri}`);
      }
    } catch (e: any) {
      Alert.alert('Backup failed', e?.message ?? 'Unknown error');
    } finally {
      setBusy(null);
    }
  };

  const onRestore = async () => {
    if (busy) return;
    setBusy('restore');
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: ['application/json', '*/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (picked.canceled) return;
      const file = picked.assets?.[0];
      if (!file) return;

      const counts = await importBackup(file.uri);
      reload();
      Alert.alert(
        'Restore complete',
        `Imported ${counts.recipes} recipe${counts.recipes === 1 ? '' : 's'}, ${counts.grocery} grocery item${counts.grocery === 1 ? '' : 's'}, ${counts.mealPlan} plan entr${counts.mealPlan === 1 ? 'y' : 'ies'}.`,
      );
    } catch (e: any) {
      Alert.alert('Restore failed', e?.message ?? 'Unknown error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenH, paddingTop: 8, paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.identity}>
          <View style={styles.avatar}><Text style={styles.avatarLetter}>{initial}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.email}>{displayEmail}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{recipeCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Cooked</Text>
          </View>
        </View>

        <Text style={styles.section}>Your data</Text>
        <View style={styles.group}>
          <Pressable onPress={onBackup} style={({ pressed }) => [styles.rowBtn, pressed && { opacity: 0.7 }]}>
            <View style={styles.rowIconWrap}><UploadIcon size={18} color={colors.accent} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Back up my recipes</Text>
              <Text style={styles.rowHelp}>Save a .json copy to your iCloud / Drive / Files</Text>
            </View>
            <ChevronRight />
          </Pressable>
          <View style={styles.divider} />
          <Pressable onPress={onRestore} style={({ pressed }) => [styles.rowBtn, pressed && { opacity: 0.7 }]}>
            <View style={styles.rowIconWrap}><DownloadIcon size={18} color={colors.accent} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Restore from backup</Text>
              <Text style={styles.rowHelp}>Pick a Recipiny .json file</Text>
            </View>
            <ChevronRight />
          </Pressable>
        </View>

        <Text style={styles.section}>Settings</Text>
        <View style={styles.group}>
          {SETTINGS.map((s, idx) => (
            <React.Fragment key={s.key}>
              <Pressable
                onPress={s.onPress}
                style={({ pressed }) => [styles.rowBtn, pressed && { opacity: 0.7 }]}>
                <View style={styles.dot} />
                <Text style={[styles.rowLabel, { flex: 1 }]}>{s.label}</Text>
                <ChevronRight />
              </Pressable>
              {idx < SETTINGS.length - 1 ? <View style={styles.divider} /> : null}
            </React.Fragment>
          ))}
        </View>

        {user ? (
          <Pressable
            onPress={onLogout}
            disabled={busy === 'signout'}
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
            <Text style={styles.logout}>
              {busy === 'signout' ? 'Logging out…' : 'Log out'}
            </Text>
          </Pressable>
        ) : null}
        <Text style={styles.version}>Recipiny · v{appVersion}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: font.black, fontSize: 34, color: colors.text, letterSpacing: -1, marginBottom: 22 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 30 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { fontFamily: font.black, fontSize: 30, color: colors.onAccent },
  name: { fontFamily: font.black, fontSize: 22, color: colors.text, letterSpacing: -0.4 },
  email: { fontFamily: font.bold, fontSize: 14, color: colors.dim, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 12, marginBottom: 26 },
  statCard: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 16 },
  statValue: { fontFamily: font.black, fontSize: 26, color: colors.accent },
  statLabel: { fontFamily: font.bold, fontSize: 13, color: colors.dim, marginTop: 2 },
  section: { fontFamily: font.extrabold, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', color: colors.dim, marginBottom: 8, marginLeft: 4 },
  group: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: 22,
  },
  rowBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingVertical: 16 },
  rowIconWrap: { width: 8, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  rowLabel: { fontFamily: font.bold, fontSize: 16, color: colors.text },
  rowHelp: { fontFamily: font.semibold, fontSize: 12, color: colors.dim, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.line, marginLeft: 18 + 8 + 14 },
  authCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.accent,
    paddingHorizontal: 18, paddingVertical: 16,
    borderRadius: radius.lg,
    marginBottom: 22,
  },
  authCtaText: { fontFamily: font.black, fontSize: 16, color: colors.onAccent },
  logout: { textAlign: 'center', fontFamily: font.extrabold, fontSize: 16, color: colors.danger, padding: 14 },
  version: { textAlign: 'center', fontFamily: font.bold, fontSize: 12, color: colors.dim, marginTop: 4 },
});
