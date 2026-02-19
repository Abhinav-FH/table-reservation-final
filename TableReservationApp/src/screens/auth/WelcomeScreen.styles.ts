import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';
import { ThemeColors } from '../../theme/themeUtils';

export function createWelcomeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    hero: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
    },
    logoCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 12,
    },
    appName: {
      fontSize: FontSize.xxxl,
      fontWeight: FontWeight.bold,
      color: colors.text,
      letterSpacing: 0.5,
    },
    tagline: {
      marginTop: Spacing.sm,
      fontSize: FontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    actions: {
      padding: Spacing.xl,
      paddingBottom: Spacing.xxl,
    },
    prompt: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.semibold,
      color: colors.text,
      marginBottom: Spacing.md,
      textAlign: 'center',
    },
    spacer: {
      height: Spacing.md,
    },
  });
}
