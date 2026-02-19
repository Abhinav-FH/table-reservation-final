import { StyleSheet } from 'react-native';
import { FontSize, FontWeight, Spacing } from '../../constants/layout';
import { ThemeColors } from '../../theme/themeUtils';

export function createEmptyStateStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.xl,
    },
    title: {
      marginTop: Spacing.md,
      fontSize: FontSize.xl,
      fontWeight: FontWeight.semibold,
      color: colors.text,
      textAlign: 'center',
    },
    message: {
      marginTop: Spacing.sm,
      fontSize: FontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    button: {
      marginTop: Spacing.lg,
    },
  });
}
