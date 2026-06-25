import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme/colors';
import { font } from '@/theme/type';
import { ChevronRight } from './Icon';
import { CoverImage } from './CoverImage';
import type { Recipe } from '@/types/recipe';

type Props = { recipe: Recipe; onPress: () => void };

export function RecipeRow({ recipe, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { transform: [{ scale: 0.99 }] }]}>
      <CoverImage
        imageKey={recipe.image}
        tone={recipe.tone}
        rounded={13}
        style={styles.thumb}
      />
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>{recipe.title}</Text>
        <Text style={styles.sub}>{recipe.cookTime} min · {recipe.sourceApp}</Text>
      </View>
      <ChevronRight />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 12,
  },
  thumb: { width: 58, height: 58 },
  text: { flex: 1, minWidth: 0 },
  title: { fontFamily: font.extrabold, fontSize: 16, color: colors.text },
  sub: { fontFamily: font.bold, fontSize: 13, color: colors.dim, marginTop: 2 },
});
