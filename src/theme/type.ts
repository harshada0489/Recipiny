import { TextStyle } from 'react-native';

export const font = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

export const text = {
  title: { fontFamily: font.black, fontSize: 40, letterSpacing: -1.2, lineHeight: 42 } as TextStyle,
  h1: { fontFamily: font.black, fontSize: 34, letterSpacing: -1 } as TextStyle,
  h2: { fontFamily: font.black, fontSize: 30, letterSpacing: -0.8, lineHeight: 32 } as TextStyle,
  h3: { fontFamily: font.black, fontSize: 22, letterSpacing: -0.4 } as TextStyle,
  body: { fontFamily: font.semibold, fontSize: 16 } as TextStyle,
  bodyBold: { fontFamily: font.extrabold, fontSize: 16 } as TextStyle,
  small: { fontFamily: font.bold, fontSize: 13 } as TextStyle,
  dim: { fontFamily: font.bold, fontSize: 13 } as TextStyle,
  eyebrow: {
    fontFamily: font.extrabold,
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  } as TextStyle,
} as const;
