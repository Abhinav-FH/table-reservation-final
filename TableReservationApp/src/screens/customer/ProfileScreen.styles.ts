import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { ThemeColors } from '../../theme/themeUtils';

export function createProfileStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    heading: {
      fontSize: FontSize.xxl,
      fontWeight: FontWeight.bold,
      color: colors.text,
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
    },
    avatarSection: {
      alignItems: 'center',
      paddingVertical: Spacing.xl,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    avatarText: {
      fontSize: FontSize.xxxl,
      fontWeight: FontWeight.bold,
      color: Colors.white,
    },
    name: {
      fontSize: FontSize.xl,
      fontWeight: FontWeight.bold,
      color: colors.text,
    },
    email: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      marginTop: 4,
    },
    roleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.errorLight,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
      borderRadius: BorderRadius.full,
      marginTop: Spacing.sm,
    },
    roleText: {
      fontSize: FontSize.xs,
      color: Colors.primary,
      fontWeight: FontWeight.semibold,
      marginLeft: 4,
    },
    section: {
      marginHorizontal: Spacing.md,
      marginBottom: Spacing.sm,
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
      ...Shadow.small,
      shadowColor: colors.shadow,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
    },
    settingLabel: {
      flex: 1,
      fontSize: FontSize.md,
      color: colors.text,
      marginLeft: Spacing.md,
    },
    logoutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
    },
    logoutText: {
      fontSize: FontSize.md,
      color: Colors.error,
      fontWeight: FontWeight.medium,
      marginLeft: Spacing.md,
    },
  });
}
