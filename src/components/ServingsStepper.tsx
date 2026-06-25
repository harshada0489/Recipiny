import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme/colors';
import { font } from '@/theme/type';
import { MinusIcon, PlusIcon } from './Icon';

type Props = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function ServingsStepper({ value, onIncrement, onDecrement }: Props) {
  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.eyebrow}>Servings</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.controls}>
        <Pressable
          onPress={onDecrement}
          style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && { transform: [{ scale: 0.92 }] }]}>
          <MinusIcon size={20} />
        </Pressable>
        <Pressable
          onPress={onIncrement}
          style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && { transform: [{ scale: 0.92 }] }]}>
          <PlusIcon size={20} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
  },
  eyebrow: { fontFamily: font.extrabold, fontSize: 13, color: colors.dim, letterSpacing: 0.4, textTransform: 'uppercase' },
  value: { fontFamily: font.black, fontSize: 22, color: colors.text, marginTop: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  btn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  btnGhost: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.line },
  btnPrimary: { backgroundColor: colors.accent },
});
