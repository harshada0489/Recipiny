import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius } from '@/theme/colors';
import { font } from '@/theme/type';

type Props = TextInputProps & { label: string };

export function AuthField({ label, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.dim}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
        style={[styles.input, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontFamily: font.extrabold,
    fontSize: 12,
    color: colors.dim,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: font.semibold,
    fontSize: 16,
    color: colors.text,
  },
});
