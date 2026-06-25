import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme/colors';
import { font } from '@/theme/type';
import { CoverImage } from './CoverImage';
import type { Recipe } from '@/types/recipe';

type Props = { recipe: Recipe; onPress: () => void };

export function RecipeTile({ recipe, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && { transform: [{ scale: 0.98 }] }]}>
      <CoverImage imageKey={recipe.image} tone={recipe.tone} style={styles.hero} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
        <Text style={styles.sub}>{recipe.cookTime} min</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  hero: { height: 104 },
  body: { paddingHorizontal: 12, paddingTop: 11, paddingBottom: 13 },
  title: { fontFamily: font.extrabold, fontSize: 14.5, color: colors.text, lineHeight: 18 },
  sub: { fontFamily: font.bold, fontSize: 12, color: colors.dim, marginTop: 4 },
});
