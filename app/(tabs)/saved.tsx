import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';

import { colors, radius, spacing } from '@/theme/colors';
import { font } from '@/theme/type';
import { SearchIcon } from '@/components/Icon';
import { RecipeTile } from '@/components/RecipeTile';
import { listRecipes } from '@/db/recipes';
import type { Recipe } from '@/types/recipe';

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState('');

  const reload = useCallback(() => {
    listRecipes().then(setRecipes).catch((e) => console.warn(e));
  }, []);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter((r) => r.title.toLowerCase().includes(q));
  }, [query, recipes]);

  const pairs = useMemo(() => {
    const rows: Recipe[][] = [];
    for (let i = 0; i < filtered.length; i += 2) {
      rows.push(filtered.slice(i, i + 2));
    }
    return rows;
  }, [filtered]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Text style={styles.title}>Saved</Text>
          <Text style={styles.sub}>{recipes.length} recipes</Text>
        </View>

        <View style={styles.search}>
          <SearchIcon />
          <TextInput
            placeholder="Search recipes"
            placeholderTextColor={colors.dim}
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
        </View>

        <View style={styles.grid}>
          {pairs.map((row, idx) => (
            <View key={idx} style={styles.row}>
              {row.map((r) => (
                <RecipeTile
                  key={r.id}
                  recipe={r}
                  onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: r.id } })}
                />
              ))}
              {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
            </View>
          ))}
          {filtered.length === 0 ? (
            <Text style={styles.empty}>
              {query ? 'No recipes match that.' : 'No saved recipes yet.'}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: { paddingHorizontal: spacing.screenH - 4, paddingTop: 8 },
  title: { fontFamily: font.black, fontSize: 34, color: colors.text, letterSpacing: -1, paddingHorizontal: 4 },
  sub: { fontFamily: font.bold, fontSize: 14, color: colors.dim, paddingHorizontal: 4, paddingTop: 2, paddingBottom: 16 },
  search: {
    marginHorizontal: spacing.screenH - 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: font.semibold,
    fontSize: 16,
    height: 36,
    padding: 0,
  },
  grid: { paddingHorizontal: spacing.screenH - 4, gap: 14 },
  row: { flexDirection: 'row', gap: 14 },
  empty: { fontFamily: font.semibold, fontSize: 14, color: colors.dim, padding: 12 },
});
