import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { ThemeColors } from '../../theme/themeUtils';

export function createAuthStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: { flex: 1 },
    content: {
      flexGrow: 1,
      padding: Spacing.xl,
      paddingTop: Spacing.lg,
    },
    backBtn: {
      alignSelf: 'flex-start',
      marginBottom: Spacing.lg,
      padding: Spacing.xs,
    },
    header: {
      marginBottom: Spacing.xl,
    },
    roleTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.errorLight,
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: BorderRadius.full,
      marginBottom: Spacing.sm,
    },
    roleText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.primary,
      marginLeft: 4,
    },
    title: {
      fontSize: FontSize.xxl,
      fontWeight: FontWeight.bold,
      color: colors.text,
    },
    subtitle: {
      marginTop: Spacing.xs,
      fontSize: FontSize.md,
      color: colors.textSecondary,
    },
    submitBtn: {
      marginTop: Spacing.md,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: Spacing.lg,
    },
    footerText: {
      fontSize: FontSize.md,
      color: colors.textSecondary,
    },
    footerLink: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.primary,
    },
  });
}
