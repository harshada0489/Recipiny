import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  PressableProps,
} from 'react-native';
import { colors, radius } from '@/theme/colors';
import { font } from '@/theme/type';

type Props = PressableProps & {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export function PrimaryButton({ label, icon, variant = 'primary', style, ...rest }: Props) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
        style,
      ]}>
      <View style={styles.row}>
        {icon}
        <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: 68,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.6,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  primaryPressed: { backgroundColor: colors.accentPress, transform: [{ scale: 0.98 }] },
  secondary: {
    height: 52,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
  },
  secondaryPressed: { backgroundColor: colors.card, transform: [{ scale: 0.98 }] },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { fontFamily: font.black, fontSize: 19 },
  labelPrimary: { color: colors.onAccent },
  labelSecondary: { color: colors.text, fontSize: 15, fontFamily: font.extrabold },
});
