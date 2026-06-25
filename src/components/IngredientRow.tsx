import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { font } from '@/theme/type';
import { CheckIcon } from './Icon';

type Props = {
  amount: string;
  name: string;
  checked: boolean;
  onPress: () => void;
  /**
   * Increment this number to trigger a one-shot green flash (e.g. when the
   * ingredient just changed because of the Tastier ↔ Healthier toggle).
   * Initial value of 0 means "no flash". Any change to a positive value
   * fires the animation.
   */
  flashKey?: number;
};

export function IngredientRow({ amount, name, checked, onPress, flashKey = 0 }: Props) {
  const flash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (flashKey > 0) {
      flash.setValue(1);
      // Match the design's flashGreen keyframe: hold solid green for 600ms,
      // then fade to transparent over the next 600ms. A simple linear fade
      // makes the green too brief to register against the dark background.
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(flash, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [flashKey, flash]);

  const bg = flash.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', 'rgba(34,214,124,0.45)'],
  });

  return (
    <Animated.View style={{ backgroundColor: bg, borderRadius: 10 }}>
      <Pressable onPress={onPress} style={styles.row}>
        <View
          style={[
            styles.box,
            {
              borderColor: checked ? colors.accent : 'rgba(255,255,255,0.22)',
              backgroundColor: checked ? colors.accent : 'transparent',
            },
          ]}>
          {checked ? <CheckIcon size={16} /> : null}
        </View>
        <Text
          style={[
            styles.text,
            checked && { color: colors.dim, textDecorationLine: 'line-through' },
          ]}>
          <Text style={styles.amount}>{amount}</Text> {name}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  box: {
    width: 27,
    height: 27,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, fontFamily: font.semibold, fontSize: 16, color: colors.text },
  amount: { fontFamily: font.extrabold },
});
