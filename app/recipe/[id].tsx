import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

import { colors, radius, spacing } from '@/theme/colors';
import { font } from '@/theme/type';
import {
  CameraIcon,
  ChevronLeft,
  ClockIcon,
  ExternalLinkIcon,
  PencilIcon,
  PlayIcon,
  TrashIcon,
} from '@/components/Icon';
import { CoverImage } from '@/components/CoverImage';
import { IngredientRow } from '@/components/IngredientRow';
import { ServingsStepper } from '@/components/ServingsStepper';
import { PrimaryButton } from '@/components/PrimaryButton';
import {
  deleteRecipe,
  getRecipe,
  updateRecipeImage,
  updateRecipeNotes,
  updateRecipeTitle,
} from '@/db/recipes';
import { pickCoverImage } from '@/lib/pickCoverImage';
import { scaledAmount } from '@/lib/format';
import {
  changedIngredientIndices,
  healthierCalories,
  healthifyIngredient,
  healthifyText,
} from '@/lib/healthify';
import type { Recipe } from '@/types/recipe';

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [servings, setServings] = useState<number>(1);
  const [checked, setChecked] = useState<number[]>([]);
  const [healthier, setHealthier] = useState(false);
  const [flashTick, setFlashTick] = useState(0);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  useEffect(() => {
    if (!id) return;
    getRecipe(id)
      .then((r) => {
        setRecipe(r);
        if (r) setServings(r.servings);
      })
      .catch((e) => console.warn(e));
  }, [id]);

  const toggle = useCallback((i: number) => {
    setChecked((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }, []);

  const changedIndices = useMemo(
    () => (recipe ? changedIngredientIndices(recipe.ingredients) : []),
    [recipe],
  );

  // Calorie flash — animates the cal text accent → dim on toggle.
  const calFlash = useRef(new Animated.Value(0)).current;
  const calColor = calFlash.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.dim, colors.accent],
  });

  const openSource = async () => {
    if (!recipe?.sourceUrl) return;
    try {
      const supported = await Linking.canOpenURL(recipe.sourceUrl);
      if (!supported) {
        Alert.alert('Cannot open link', "This link can't be opened on your device.");
        return;
      }
      await Linking.openURL(recipe.sourceUrl);
    } catch (e) {
      Alert.alert('Could not open link', e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const startEditTitle = () => {
    if (!recipe) return;
    setTitleDraft(recipe.title);
    setEditingTitle(true);
  };

  const commitEditTitle = async () => {
    if (!recipe || !editingTitle) return;
    const next = titleDraft.trim();
    setEditingTitle(false);
    if (!next || next === recipe.title) return;
    try {
      await updateRecipeTitle(recipe.id, next);
      setRecipe({ ...recipe, title: next });
    } catch (e) {
      Alert.alert('Could not save title', e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const startEditNotes = () => {
    if (!recipe) return;
    setNotesDraft(recipe.notes ?? '');
    setEditingNotes(true);
  };

  const commitEditNotes = async () => {
    if (!recipe || !editingNotes) return;
    const next = notesDraft.trim();
    setEditingNotes(false);
    const normalised = next.length > 0 ? next : null;
    if (normalised === recipe.notes) return;
    try {
      await updateRecipeNotes(recipe.id, normalised);
      setRecipe({ ...recipe, notes: normalised });
    } catch (e) {
      Alert.alert('Could not save note', e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const onChangeCover = async () => {
    if (!recipe) return;
    try {
      const newUri = await pickCoverImage(recipe.id);
      if (!newUri) return;
      await updateRecipeImage(recipe.id, newUri);
      setRecipe({ ...recipe, image: newUri });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      if (msg === 'IMAGE_PICKER_UNAVAILABLE') {
        Alert.alert(
          'Image picker not available',
          'Your current runtime is missing the photo-picker module. Open this project in the latest Expo Go (App Store), or rebuild your dev client.',
        );
        return;
      }
      Alert.alert('Could not change cover', msg);
    }
  };

  const onDelete = () => {
    if (!recipe) return;
    Alert.alert(
      'Delete recipe?',
      `"${recipe.title}" will be removed from your saved recipes. This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipe.id);
              router.back();
            } catch (e) {
              Alert.alert('Could not delete', e instanceof Error ? e.message : 'Unknown error');
            }
          },
        },
      ],
    );
  };

  const onModeChange = (next: boolean) => {
    if (next === healthier) return;
    setHealthier(next);
    // Only fire flash animations when there's an actual change to highlight.
    // The ingredient rows are already gated per-row via changedIndices, but
    // the calorie pulse needs an explicit guard here so it stays quiet when
    // nothing about the recipe is changing.
    if (changedIndices.length > 0) {
      setFlashTick((t) => t + 1);
      calFlash.setValue(1);
      Animated.timing(calFlash, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  };

  if (!recipe) {
    return <SafeAreaView style={styles.root} />;
  }

  const ratio = servings / recipe.servings;

  const displayIngredients = healthier
    ? recipe.ingredients.map(healthifyIngredient)
    : recipe.ingredients;
  const displaySteps = healthier ? recipe.steps.map(healthifyText) : recipe.steps;

  const swapRatio =
    recipe.ingredients.length > 0 ? changedIndices.length / recipe.ingredients.length : 0;
  const hasSwaps = changedIndices.length > 0;
  const baseCal = recipe.calories;
  const displayCal = healthier ? healthierCalories(baseCal, swapRatio) : baseCal;
  const savedCal = baseCal != null && displayCal != null ? baseCal - displayCal : 0;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <CoverImage imageKey={recipe.image} tone={recipe.tone} style={StyleSheet.absoluteFillObject as any} />
          <LinearGradient
            colors={['rgba(8,9,8,0.45)', 'transparent', 'rgba(8,9,8,0.5)']}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <View style={[styles.heroBar, { paddingTop: insets.top + 6 }]}>
            <Pressable onPress={() => router.back()} style={styles.iconBtn}>
              <ChevronLeft color="#fff" />
            </Pressable>
            <Pressable onPress={onDelete} style={styles.iconBtn}>
              <TrashIcon size={20} color="#fff" />
            </Pressable>
          </View>
          {recipe.sourceUrl ? (
            <Pressable
              onPress={openSource}
              style={({ pressed }) => [styles.sourcePill, pressed && { opacity: 0.75 }]}>
              <View style={styles.dot} />
              <Text style={styles.sourceText}>Imported from {recipe.sourceApp}</Text>
              <ExternalLinkIcon size={12} color="#fff" />
            </Pressable>
          ) : (
            <View style={styles.sourcePill}>
              <View style={styles.dot} />
              <Text style={styles.sourceText}>Imported from {recipe.sourceApp}</Text>
            </View>
          )}
          <Pressable
            onPress={onChangeCover}
            style={({ pressed }) => [styles.coverBtn, pressed && { opacity: 0.85 }]}>
            <CameraIcon size={15} color="#fff" />
            <Text style={styles.coverBtnText}>Change cover</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          {editingTitle ? (
            <TextInput
              value={titleDraft}
              onChangeText={setTitleDraft}
              onBlur={commitEditTitle}
              onSubmitEditing={commitEditTitle}
              autoFocus
              selectTextOnFocus
              multiline
              blurOnSubmit
              returnKeyType="done"
              style={[styles.title, styles.titleInput]}
            />
          ) : (
            <Pressable onPress={startEditTitle} style={styles.titleRow}>
              <Text style={[styles.title, { flexShrink: 1 }]}>{recipe.title}</Text>
              <PencilIcon size={18} />
            </Pressable>
          )}
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <ClockIcon size={17} />
              <Text style={styles.metaText}>{recipe.cookTime} min</Text>
            </View>
            {displayCal != null ? (
              <Animated.View style={[styles.metaItem, { transform: [{ scale: calFlash.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] }) }] }]}>
                <CalIcon color={colors.dim} />
                <Animated.Text style={[styles.metaText, { color: calColor as any }]}>
                  {displayCal} cal
                </Animated.Text>
              </Animated.View>
            ) : null}
            <Text style={styles.metaText}>· {recipe.steps.length} steps</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.screenH, marginTop: 18 }}>
          <View style={styles.toggle}>
            <ToggleButton
              label="Tastier"
              active={!healthier}
              onPress={() => onModeChange(false)}
              icon={<FlameIcon active={!healthier} />}
            />
            <ToggleButton
              label="Healthier"
              active={healthier}
              onPress={() => onModeChange(true)}
              icon={<LeafIcon active={healthier} />}
            />
          </View>
          <Text style={[styles.toggleCaption, healthier && hasSwaps && { color: colors.accent }]}>
            {!healthier
              ? 'Full-flavor original recipe'
              : hasSwaps
                ? `Lighter swaps applied${savedCal > 0 ? ` · saved ${savedCal} cal` : ''}`
                : 'No lighter swaps available for this recipe'}
          </Text>
        </View>

        <View style={{ paddingHorizontal: spacing.screenH, marginTop: 14, marginBottom: 18 }}>
          <ServingsStepper
            value={servings}
            onIncrement={() => setServings((s) => Math.min(16, s + 1))}
            onDecrement={() => setServings((s) => Math.max(1, s - 1))}
          />
        </View>

        <View style={{ paddingHorizontal: spacing.screenH }}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.linkMuted}>Grocery list</Text>
          </View>
          {displayIngredients.map((ing, i) => {
            const amount = scaledAmount(ing.amount, ratio) + (ing.unit ? ` ${ing.unit}` : '');
            // Items in changedIndices animate every time the toggle flips into
            // healthier mode. flashTick combined with the index uniquely keys
            // each fire so React.useEffect retriggers cleanly.
            const isChanged = changedIndices.includes(i);
            return (
              <IngredientRow
                key={i}
                amount={amount}
                name={ing.name}
                checked={checked.includes(i)}
                onPress={() => toggle(i)}
                flashKey={isChanged ? flashTick : 0}
              />
            );
          })}
        </View>

        <View style={{ paddingHorizontal: spacing.screenH, paddingTop: 24, paddingBottom: 24 }}>
          <Text style={styles.sectionTitle}>Steps</Text>
          <View style={{ gap: 18, marginTop: 12 }}>
            {displaySteps.map((s, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNumWrap}>
                  <Text style={styles.stepNum}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.screenH, paddingBottom: 8 }}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Notes</Text>
            {recipe.notes && !editingNotes ? (
              <Pressable onPress={startEditNotes}>
                <Text style={styles.linkMuted}>Edit</Text>
              </Pressable>
            ) : null}
          </View>
          {editingNotes ? (
            <TextInput
              value={notesDraft}
              onChangeText={setNotesDraft}
              onBlur={commitEditNotes}
              autoFocus
              multiline
              placeholder="Anything you'd like to remember…"
              placeholderTextColor={colors.dim}
              style={styles.notesInput}
            />
          ) : (
            <Pressable onPress={startEditNotes} style={styles.notesCard}>
              {recipe.notes ? (
                <Text style={styles.notesText}>{recipe.notes}</Text>
              ) : (
                <Text style={styles.notesEmpty}>Tap to add a note</Text>
              )}
            </Pressable>
          )}
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + 14 }]}>
        <PrimaryButton
          label="Cook"
          icon={<PlayIcon size={22} />}
          onPress={() => router.push({ pathname: '/cook/[id]', params: { id: recipe.id } })}
          style={{ height: 64 }}
        />
      </View>
    </View>
  );
}

function ToggleButton({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.toggleBtn,
        active && styles.toggleBtnActive,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}>
      {icon}
      <Text style={[styles.toggleLabel, active && styles.toggleLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function FlameIcon({ active }: { active: boolean }) {
  const color = active ? colors.onAccent : colors.dim;
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2.5c1.6 3.2 5 4.8 5 8.8a5 5 0 0 1-10 0c0-1.7.8-2.9 1.8-3.9.3 1.3 1.2 2.1 2.2 2.1 0-2.4-1-4.6-1-7z" />
    </Svg>
  );
}

function LeafIcon({ active }: { active: boolean }) {
  const color = active ? colors.onAccent : colors.dim;
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <Path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </Svg>
  );
}

function CalIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 21c4-2.5 6-5.6 6-9a6 6 0 0 0-12 0c0 3.4 2 6.5 6 9z" />
      <Path d="M12 3c0 2 1.5 3 1.5 5" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { height: 262, backgroundColor: colors.card, overflow: 'hidden' },
  heroBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18 },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(8,9,8,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
  sourcePill: {
    position: 'absolute', left: 16, bottom: 14,
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(8,9,8,0.5)',
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
  },
  coverBtn: {
    position: 'absolute', right: 16, bottom: 14,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(8,9,8,0.55)',
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
  },
  coverBtnText: { fontFamily: font.extrabold, fontSize: 12, color: '#fff' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  sourceText: { fontFamily: font.extrabold, fontSize: 12, color: '#fff' },
  body: { paddingHorizontal: spacing.screenH, paddingTop: 22, paddingBottom: 8 },
  title: { fontFamily: font.black, fontSize: 30, color: colors.text, letterSpacing: -0.8, lineHeight: 34 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  titleInput: { padding: 0, margin: 0, textAlignVertical: 'top' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontFamily: font.bold, fontSize: 14, color: colors.dim },

  toggle: {
    flexDirection: 'row', gap: 6, padding: 5,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.lg,
  },
  toggleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 13, borderRadius: radius.md,
    backgroundColor: 'transparent',
  },
  toggleBtnActive: { backgroundColor: colors.accent },
  toggleLabel: { fontFamily: font.black, fontSize: 15.5, letterSpacing: -0.2, color: colors.dim },
  toggleLabelActive: { color: colors.onAccent },
  toggleCaption: {
    textAlign: 'center', marginTop: 10,
    fontFamily: font.bold, fontSize: 12.5, color: colors.dim,
  },

  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 },
  sectionTitle: { fontFamily: font.black, fontSize: 19, color: colors.text, letterSpacing: -0.3 },
  linkMuted: { fontFamily: font.extrabold, fontSize: 13, color: colors.accent },
  stepRow: { flexDirection: 'row', gap: 15 },
  stepNumWrap: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNum: { fontFamily: font.black, fontSize: 15, color: colors.accent },
  stepText: { flex: 1, fontFamily: font.semibold, fontSize: 15.5, color: colors.text, lineHeight: 23, paddingTop: 3 },
  notesCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 70,
    marginTop: 10,
  },
  notesInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 100,
    marginTop: 10,
    fontFamily: font.semibold,
    fontSize: 15,
    color: colors.text,
    lineHeight: 21,
    textAlignVertical: 'top',
  },
  notesText: { fontFamily: font.semibold, fontSize: 15, color: colors.text, lineHeight: 21 },
  notesEmpty: { fontFamily: font.semibold, fontSize: 15, color: colors.dim, fontStyle: 'italic' },
  cta: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: 22, paddingTop: 14,
    backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.line,
  },
});
