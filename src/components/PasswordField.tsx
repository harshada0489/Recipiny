import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius } from '@/theme/colors';
import { font } from '@/theme/type';
import { EyeIcon, EyeOffIcon } from './Icon';
import { passwordStrength } from '@/lib/passwordStrength';

type Props = TextInputProps & {
  label: string;
  /** When true, shows a strength meter + label under the field. */
  showStrength?: boolean;
  /** Optional helper line below the field (e.g. "Passwords don't match"). */
  helper?: string | null;
  /** Colour of the helper text — defaults to dim. */
  helperColor?: string;
};

export function PasswordField({
  label,
  value,
  showStrength,
  helper,
  helperColor,
  style,
  ...rest
}: Props) {
  const [visible, setVisible] = useState(false);
  const strength = passwordStrength(String(value ?? ''));

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          placeholderTextColor={colors.dim}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!visible}
          {...rest}
          style={[styles.input, style]}
        />
        <Pressable
          onPress={() => setVisible((v) => !v)}
          hitSlop={10}
          style={styles.eyeBtn}>
          {visible ? <EyeOffIcon size={20} color={colors.dim} /> : <EyeIcon size={20} color={colors.dim} />}
        </Pressable>
      </View>

      {showStrength && value ? (
        <View style={styles.strengthRow}>
          <View style={styles.strengthBar}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={[
                  styles.strengthSeg,
                  {
                    backgroundColor:
                      i < strength.segments ? strength.color : 'rgba(255,255,255,0.08)',
                  },
                ]}
              />
            ))}
          </View>
          {strength.label ? (
            <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
          ) : null}
        </View>
      ) : null}

      {helper ? (
        <Text style={[styles.helper, { color: helperColor ?? colors.dim }]}>{helper}</Text>
      ) : null}
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: font.semibold,
    fontSize: 16,
    color: colors.text,
  },
  eyeBtn: { padding: 6 },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    marginLeft: 4,
  },
  strengthBar: { flex: 1, flexDirection: 'row', gap: 4 },
  strengthSeg: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontFamily: font.extrabold, fontSize: 12, minWidth: 50, textAlign: 'right' },
  helper: { fontFamily: font.semibold, fontSize: 12, marginTop: 6, marginLeft: 4 },
});
