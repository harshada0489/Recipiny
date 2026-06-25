import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme/colors';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  contentStyle?: ViewStyle;
};

export function ScreenContainer({ children, scroll, edges = ['top'], contentStyle }: Props) {
  const insets = useSafeAreaInsets();
  if (scroll) {
    return (
      <SafeAreaView style={styles.root} edges={edges}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 24 },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.root} edges={edges}>
      <View style={[styles.container, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, paddingHorizontal: spacing.screenH },
  scroll: { paddingHorizontal: spacing.screenH, paddingTop: 8 },
});
