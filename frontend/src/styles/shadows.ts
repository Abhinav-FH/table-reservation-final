import { Platform, ViewStyle } from 'react-native';

export const Shadows = {
  soft: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#8B6A42',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
  })!,
  medium: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#8B6A42',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
  })!,
  strong: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#4A2E0A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
    },
    android: { elevation: 10 },
  })!,
};