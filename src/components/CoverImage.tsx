import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View, ViewStyle } from 'react-native';

// Bundled cover photos used by the seeded sample recipes. Imported recipes
// from the backend pass a full URL in `imageKey` instead — handled below.
const BUNDLED: Record<string, ImageSourcePropType> = {
  'cover-tuscan': require('../../assets/covers/cover-tuscan.jpg'),
  'cover-honey': require('../../assets/covers/cover-honey.jpg'),
  'cover-goddess': require('../../assets/covers/cover-goddess.jpg'),
  'cover-miso': require('../../assets/covers/cover-miso.jpg'),
  'cover-smash': require('../../assets/covers/cover-smash.jpg'),
  'cover-oats': require('../../assets/covers/cover-oats.jpg'),
};

type Props = {
  imageKey: string | null;
  tone: string;
  style?: ViewStyle;
  rounded?: number;
};

function resolveSource(imageKey: string | null): ImageSourcePropType | undefined {
  if (!imageKey) return undefined;
  // Remote URLs from the import API, or file:// URIs from user-picked images.
  if (/^(https?|file):\/\//i.test(imageKey)) return { uri: imageKey };
  return BUNDLED[imageKey];
}

export function CoverImage({ imageKey, tone, style, rounded }: Props) {
  const src = resolveSource(imageKey);
  const baseStyle: ViewStyle = {
    backgroundColor: tone,
    overflow: 'hidden',
    borderRadius: rounded,
  };
  if (src) {
    return (
      <View style={[baseStyle, style]}>
        <Image source={src} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      </View>
    );
  }
  return <View style={[baseStyle, style]} />;
}
