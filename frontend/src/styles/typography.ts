import { StyleSheet, TextStyle } from 'react-native';

// Font families (loaded via expo-google-fonts)
export const Fonts = {
  display: 'PlayfairDisplay_700Bold',
  displayItalic: 'PlayfairDisplay_700Bold_Italic',
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansBold: 'DMSans_700Bold',
} as const;

export const Typography = StyleSheet.create<Record<string, TextStyle>>({
  displayLarge: {
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily: Fonts.display,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: Fonts.sansBold,
    fontSize: 18,
    lineHeight: 24,
  },
  h3: {
    fontFamily: Fonts.sansMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: Fonts.sansMedium,
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});