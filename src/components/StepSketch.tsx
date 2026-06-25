import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';

type SketchKind = 'pot' | 'pan' | 'bowl' | 'knife' | 'oven' | 'plate';

const INK = colors.accent;

const LABELS: Record<SketchKind, string> = {
  pot: 'Boil',
  pan: 'Sauté',
  bowl: 'Mix',
  knife: 'Prep',
  oven: 'Bake',
  plate: 'Serve',
};

export function pickSketch(text: string): SketchKind {
  const t = (text || '').toLowerCase();
  const has = (...words: string[]) => words.some((w) => t.includes(w));
  if (has('roast', 'bake', 'broil', 'oven', '400f', 'degrees', 'caramelize the top')) return 'oven';
  if (has('boil', 'simmer', 'drain', 'blanch', 'al dente')) return 'pot';
  if (has('fry', 'saut', 'sear', 'skillet', 'griddle', 'toast', 'crisp', 'hot oil', 'pan')) return 'pan';
  if (has('chop', 'slice', 'mince', 'cut', 'dice', 'form', 'smash', 'shape', 'cube')) return 'knife';
  if (has('serve', 'plate', 'garnish', 'stack', 'build the', 'over rice', 'top with', 'scatter')) return 'plate';
  return 'bowl';
}

type Props = { stepText: string };

export function StepSketch({ stepText }: Props) {
  const kind = useMemo(() => pickSketch(stepText), [stepText]);
  const label = LABELS[kind];

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.illoWrap}>
        <SketchSvg kind={kind} />
      </View>
    </View>
  );
}

function SketchSvg({ kind }: { kind: SketchKind }) {
  switch (kind) {
    case 'pot':
      return <Pot />;
    case 'pan':
      return <Pan />;
    case 'bowl':
      return <Bowl />;
    case 'knife':
      return <Knife />;
    case 'oven':
      return <Oven />;
    case 'plate':
      return <Plate />;
  }
}

const inkProps = {
  stroke: INK,
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

function Pot() {
  return (
    <Svg viewBox="0 0 150 92" height={80} width={130}>
      <G {...inkProps}>
        <Path d="M60 14 c-4 -4 4 -8 0 -12" strokeWidth={1.2} opacity={0.65} />
        <Path d="M76 12 c-4 -4 4 -8 0 -12" strokeWidth={1.2} opacity={0.65} />
        <Path d="M90 15 c-4 -4 4 -8 0 -12" strokeWidth={1.2} opacity={0.65} />
        <Ellipse cx={75} cy={35} rx={44} ry={11} />
        <Ellipse cx={75} cy={35} rx={35} ry={7.5} opacity={0.5} />
        <Path d="M31 35 C30 59 42 77 75 77 C108 77 120 59 119 35" />
        <Path d="M31 41 C18 42 17 58 30 59" />
        <Path d="M119 41 C132 42 133 58 120 59" />
        <Circle cx={60} cy={34} r={4} />
        <Circle cx={74} cy={31} r={5} />
        <Circle cx={88} cy={35} r={3.4} />
        <Circle cx={67} cy={38} r={2.4} />
        <Circle cx={81} cy={39} r={2.8} />
        <Path d="M96 61 l10 8 M101 57 l9 7 M90 67 l8 6" strokeWidth={1} opacity={0.4} />
      </G>
    </Svg>
  );
}

function Pan() {
  return (
    <Svg viewBox="0 0 162 92" height={74} width={140}>
      <G {...inkProps}>
        <Path d="M40 86 c5 -6 -5 -10 0 -16" strokeWidth={1.1} opacity={0.55} />
        <Path d="M58 88 c5 -6 -5 -10 0 -16" strokeWidth={1.1} opacity={0.55} />
        <Path d="M76 86 c5 -6 -5 -10 0 -16" strokeWidth={1.1} opacity={0.55} />
        <Ellipse cx={58} cy={46} rx={44} ry={14} />
        <Ellipse cx={58} cy={46} rx={35} ry={10.5} opacity={0.5} />
        <Path d="M14 46 C15 58 30 66 58 66 C86 66 101 58 102 46" />
        <Path d="M100 42 L152 35" />
        <Path d="M101 49 L152 43" />
        <Path d="M152 35 L152 43" />
        <Circle cx={144} cy={39} r={2.2} opacity={0.6} />
        <Circle cx={48} cy={46} r={6} />
        <Circle cx={67} cy={43} r={5} />
        <Circle cx={60} cy={51} r={4} />
        <Path d="M30 58 l8 5 M40 60 l8 5" strokeWidth={1} opacity={0.35} />
      </G>
    </Svg>
  );
}

function Bowl() {
  return (
    <Svg viewBox="0 0 150 92" height={78} width={130}>
      <G {...inkProps}>
        <Path d="M88 20 c8 -2 12 6 6 10" strokeWidth={1.1} opacity={0.55} />
        <Path d="M98 16 L70 47" />
        <Ellipse cx={66} cy={51} rx={7} ry={4.5} transform="rotate(-38 66 51)" />
        <Ellipse cx={70} cy={43} rx={42} ry={10.5} />
        <Ellipse cx={70} cy={43} rx={33} ry={7} opacity={0.5} />
        <Path d="M28 43 C30 67 48 79 70 79 C92 79 110 67 112 43" />
        <Path d="M44 45 C54 51 86 51 96 45" strokeWidth={1.1} opacity={0.5} />
        <Path d="M84 61 l9 7 M90 57 l8 6" strokeWidth={1} opacity={0.35} />
      </G>
    </Svg>
  );
}

function Knife() {
  return (
    <Svg viewBox="0 0 164 92" height={72} width={150}>
      <G {...inkProps}>
        <Path d="M24 60 L116 60 L132 74 L40 74 Z" />
        <Path d="M116 62 L138 58 C144 57 146 64 140 65 L120 68" />
        <Path d="M68 24 L132 40 L68 46 Z" />
        <Path d="M132 40 L154 44 C158 45 158 39 154 38 L132 36" />
        <Ellipse cx={56} cy={66} rx={7} ry={3} />
        <Ellipse cx={74} cy={67} rx={7} ry={3} />
        <Ellipse cx={92} cy={67} rx={7} ry={3} />
        <Path d="M50 62 l6 9 M66 62 l6 9 M82 62 l6 9 M98 62 l6 9" strokeWidth={1} opacity={0.3} />
      </G>
    </Svg>
  );
}

function Oven() {
  return (
    <Svg viewBox="0 0 140 92" height={82} width={120}>
      <G {...inkProps}>
        <Rect x={26} y={18} width={88} height={62} rx={7} />
        <Path d="M26 32 L114 32" />
        <Circle cx={40} cy={25} r={2.4} />
        <Circle cx={52} cy={25} r={2.4} />
        <Path d="M40 38 L100 38" />
        <Rect x={38} y={44} width={64} height={30} rx={5} />
        <Path d="M52 60 c6 -6 -4 -10 2 -16" strokeWidth={1.1} opacity={0.5} />
        <Path d="M68 62 c6 -6 -4 -10 2 -16" strokeWidth={1.1} opacity={0.5} />
        <Path d="M84 60 c6 -6 -4 -10 2 -16" strokeWidth={1.1} opacity={0.5} />
        <Path d="M34 80 L34 87 M106 80 L106 87" />
      </G>
    </Svg>
  );
}

function Plate() {
  return (
    <Svg viewBox="0 0 162 92" height={74} width={140}>
      <G {...inkProps}>
        <Path d="M66 22 c-4 -5 4 -8 0 -13" strokeWidth={1.1} opacity={0.55} />
        <Path d="M82 20 c-4 -5 4 -8 0 -13" strokeWidth={1.1} opacity={0.55} />
        <Ellipse cx={80} cy={61} rx={54} ry={15} />
        <Ellipse cx={80} cy={59} rx={40} ry={10.5} opacity={0.5} />
        <Path d="M58 59 C60 47 72 41 80 41 C90 41 100 49 100 59" />
        <Path d="M64 55 c4 -3 8 0 10 -2 M78 57 c4 -3 8 0 10 -2" strokeWidth={1.1} opacity={0.5} />
        <Path d="M21 45 L21 55 M25 45 L25 55 M29 45 L29 55 M25 55 L25 78" />
        <Path d="M139 45 C145 49 145 57 139 59 L139 78" />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 108,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    left: 13,
    top: 10,
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  illoWrap: { alignItems: 'center', justifyContent: 'center' },
});
