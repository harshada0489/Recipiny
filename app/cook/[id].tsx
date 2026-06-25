import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';

import { colors, radius } from '@/theme/colors';
import { font } from '@/theme/type';
import { ChevronLeft, CloseIcon } from '@/components/Icon';
import { StepSketch } from '@/components/StepSketch';
import { getRecipe } from '@/db/recipes';
import type { Recipe } from '@/types/recipe';

export default function CookScreen() {
  useKeepAwake();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!id) return;
    getRecipe(id).then(setRecipe).catch((e) => console.warn(e));
  }, [id]);

  if (!recipe) {
    return <SafeAreaView style={styles.root} />;
  }

  const total = recipe.steps.length;
  const isLast = step >= total - 1;

  const next = () => {
    if (isLast) router.back();
    else setStep((s) => s + 1);
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.head}>
        <Text style={styles.stepCount}>Step {step + 1} of {total}</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <CloseIcon size={20} />
        </Pressable>
      </View>

      <View style={styles.dots}>
        {recipe.steps.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i <= step ? colors.accent : 'rgba(255,255,255,0.16)' },
            ]}
          />
        ))}
      </View>

      <Pressable style={styles.body} onPress={next}>
        <Text style={styles.eyebrow}>STEP {step + 1}</Text>
        <Text style={styles.stepText}>{recipe.steps[step]}</Text>
      </Pressable>

      <View style={styles.sketchWrap}>
        <StepSketch stepText={recipe.steps[step]} />
      </View>

      <View style={styles.controls}>
        {step > 0 ? (
          <Pressable onPress={prev} style={styles.prevBtn}>
            <ChevronLeft size={24} />
          </Pressable>
        ) : null}
        <Pressable onPress={next} style={styles.nextBtn}>
          <Text style={styles.nextLabel}>{isLast ? 'Finish' : 'Next'}</Text>
        </Pressable>
      </View>

      <Text style={styles.awake}>Screen stays awake while you cook</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 10 },
  stepCount: { fontFamily: font.extrabold, fontSize: 14, color: colors.dim },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: 6, paddingHorizontal: 24, paddingTop: 8 },
  dot: { flex: 1, height: 5, borderRadius: 3 },
  body: { flex: 1, paddingHorizontal: 28, justifyContent: 'center' },
  sketchWrap: { paddingHorizontal: 24, marginBottom: 4 },
  eyebrow: { fontFamily: font.black, fontSize: 14, color: colors.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 },
  stepText: { fontFamily: font.extrabold, fontSize: 34, color: colors.text, lineHeight: 41, letterSpacing: -0.6 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 24, paddingBottom: 4 },
  prevBtn: {
    width: 64, height: 62, borderRadius: radius.lg,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  nextBtn: {
    flex: 1, height: 62, borderRadius: radius.lg,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  nextLabel: { fontFamily: font.black, fontSize: 18, color: colors.onAccent },
  awake: { textAlign: 'center', fontFamily: font.bold, fontSize: 11, color: colors.dim, paddingVertical: 14 },
});
