import { StyleSheet, TextStyle, Platform } from 'react-native';

// Use system fonts for production-ready simplicity
export const Fonts = {
  regular: Platform.select({ ios: 'System', android: 'Roboto' }),
  medium: Platform.select({ ios: 'System', android: 'Roboto-Medium' }),
  bold: Platform.select({ ios: 'System', android: 'Roboto-Bold' }),
} as const;

export const Typography = StyleSheet.create<Record<string, TextStyle>>({
  displayLarge: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  h1: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
  },
  h2: {
    fontFamily: Fonts.medium,
    fontSize: 20,
    lineHeight: 26,
  },
  h3: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
