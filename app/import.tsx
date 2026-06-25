import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius } from '@/theme/colors';
import { font } from '@/theme/type';
import { ClipboardIcon, CloseIcon } from '@/components/Icon';
import { importRecipeFromUrl } from '@/services/importer';
import { saveRecipe } from '@/db/recipes';

const STATUS_LINES = [
  'Reading the link…',
  'Extracting ingredients & steps…',
  'Grabbing the cover photo…',
];
const PROGRESS_PCT = [30, 66, 94];

export default function ImportScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spin]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const incoming = await importRecipeFromUrl(url ?? '');
        if (cancelled) return;
        const saved = await saveRecipe(incoming);
        router.replace({ pathname: '/recipe/[id]', params: { id: saved.id } });
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'Could not import that link.');
      }
    })();
    return () => { cancelled = true; };
  }, [url, router]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const sourceLabel = (() => {
    const u = (url || '').toLowerCase();
    if (u.includes('instagram')) return 'instagram.com/reel/9x2k…';
    if (u.includes('tiktok')) return 'tiktok.com/@chef/…';
    if (u.includes('youtu')) return 'youtu.be/…';
    return (url || '').slice(0, 32) + '…';
  })();

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.urlPill}>
        <View style={styles.dot} />
        <Text style={styles.urlText} numberOfLines={1}>{sourceLabel}</Text>
      </View>

      <View style={styles.spinnerWrap}>
        <Animated.View style={[styles.spinnerRing, { transform: [{ rotate }] }]}>
          <View style={styles.spinnerInner}>
            <ClipboardIcon size={40} color={colors.accent} />
          </View>
        </Animated.View>
      </View>

      <Text style={styles.status}>{error ?? STATUS_LINES[stage]}</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${PROGRESS_PCT[stage]}%` }]} />
      </View>

      {error ? (
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <CloseIcon size={20} />
          <Text style={styles.closeLabel}>  Close</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  urlPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: radius.pill,
    marginBottom: 48,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  urlText: { fontFamily: font.bold, fontSize: 12, color: colors.dim, maxWidth: 220 },
  spinnerWrap: { width: 128, height: 128, alignItems: 'center', justifyContent: 'center', marginBottom: 42 },
  spinnerRing: {
    width: 128, height: 128, borderRadius: 64,
    borderWidth: 4, borderColor: colors.accent,
    borderTopColor: 'transparent', borderLeftColor: 'transparent',
    alignItems: 'center', justifyContent: 'center',
  },
  spinnerInner: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  status: { fontFamily: font.black, fontSize: 22, color: colors.text, letterSpacing: -0.5, textAlign: 'center', marginBottom: 22 },
  progressTrack: { width: 200, height: 6, borderRadius: 3, backgroundColor: colors.surface, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
  closeBtn: {
    flexDirection: 'row', alignItems: 'center', marginTop: 30,
    paddingHorizontal: 22, paddingVertical: 12,
    backgroundColor: colors.surface, borderRadius: radius.md,
  },
  closeLabel: { fontFamily: font.extrabold, fontSize: 14, color: colors.text },
});
