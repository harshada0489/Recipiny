import React, { useCallback, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme/colors';
import { font } from '@/theme/type';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ClipboardIcon, YouTubeIcon } from '@/components/Icon';
import { RecipeRow } from '@/components/RecipeRow';
import { listRecipes } from '@/db/recipes';
import {
  WEEKLY_PIN_LIMIT,
  countPinsThisWeek,
  formatResetDate,
  getNextWeeklyReset,
} from '@/db/pinEvents';
import type { Recipe } from '@/types/recipe';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const reload = useCallback(() => {
    listRecipes().then(setRecipes).catch((e) => console.warn(e));
  }, []);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const onPin = async () => {
    // First check: is the user under their weekly pin limit?
    try {
      const used = await countPinsThisWeek();
      if (used >= WEEKLY_PIN_LIMIT) {
        const resetOn = formatResetDate(getNextWeeklyReset());
        Alert.alert(
          'Weekly limit reached',
          `You've already pinned ${WEEKLY_PIN_LIMIT} recipes this week — that's the weekly cap. Your next pin opens up on ${resetOn}.`,
        );
        return;
      }
    } catch (e) {
      // If the count itself fails, fall through and let them try — better to
      // allow an extra pin than to block them because of a DB hiccup.
      console.warn('countPinsThisWeek failed', e);
    }

    let url = '';
    try {
      url = (await Clipboard.getStringAsync()) || '';
    } catch {}
    if (!url || !/^https?:\/\//i.test(url)) {
      Alert.alert(
        'Paste a recipe link',
        'Copy a link from Instagram, TikTok or YouTube, then tap Pin again.',
      );
      return;
    }
    router.push({ pathname: '/import', params: { url } });
  };

  const onTryYouTube = async () => {
    // Try the native YouTube deep link first. If YouTube isn't installed,
    // the call fails — we then fall back to the web URL, which the OS
    // routes to the YouTube app via universal links (or opens in the
    // browser if no app is installed).
    try {
      await Linking.openURL('youtube://');
    } catch {
      try {
        await Linking.openURL('https://www.youtube.com');
      } catch {
        Alert.alert('Could not open YouTube', 'No app or browser is available.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.title}>Pin Recipe</Text>

          <PrimaryButton
            label="Pin"
            icon={<ClipboardIcon color={colors.onAccent} />}
            onPress={onPin}
          />

          <Text style={styles.helper}>from Instagram, TikTok or YouTube</Text>

          <PrimaryButton
            label="Try it: share from YouTube"
            variant="secondary"
            icon={<YouTubeIcon />}
            onPress={onTryYouTube}
            style={{ marginTop: 16 }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.eyebrow}>Recently saved</Text>
          <View style={{ gap: 12 }}>
            {recipes.slice(0, 5).map((r) => (
              <RecipeRow
                key={r.id}
                recipe={r}
                onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: r.id } })}
              />
            ))}
            {recipes.length === 0 ? (
              <Text style={styles.empty}>Your saved recipes will appear here.</Text>
            ) : null}
            {recipes.length > 5 ? (
              <Pressable onPress={() => router.push('/saved')}>
                <Text style={styles.seeAll}>See all {recipes.length} recipes →</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { paddingHorizontal: spacing.screenH, paddingTop: 16, paddingBottom: 18 },
  title: {
    fontFamily: font.black,
    fontSize: 40,
    letterSpacing: -1.2,
    color: colors.text,
    marginBottom: 26,
    lineHeight: 42,
  },
  helper: {
    textAlign: 'center',
    fontFamily: font.bold,
    fontSize: 13,
    color: colors.dim,
    marginTop: 14,
  },
  section: { paddingHorizontal: spacing.screenH, paddingTop: 6, paddingBottom: 26 },
  eyebrow: {
    fontFamily: font.extrabold,
    fontSize: 13,
    color: colors.dim,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  empty: { fontFamily: font.semibold, fontSize: 14, color: colors.dim, paddingVertical: 12 },
  seeAll: { fontFamily: font.extrabold, fontSize: 14, color: colors.accent, paddingTop: 6, paddingBottom: 8, textAlign: 'center' },
});
