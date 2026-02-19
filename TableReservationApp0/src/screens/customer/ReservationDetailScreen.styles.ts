import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/layout';
import { ThemeColors } from '../../theme/themeUtils';

export function createDetailStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      padding: Spacing.xs,
      marginRight: Spacing.sm,
    },
    title: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.semibold,
      color: colors.text,
      flex: 1,
    },
    content: {
      padding: Spacing.md,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      ...Shadow.small,
      shadowColor: colors.shadow,
    },
    restaurantName: {
      fontSize: FontSize.xl,
      fontWeight: FontWeight.bold,
      color: colors.text,
    },
    address: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: colors.text,
      marginBottom: Spacing.sm,
    },
    tableItem: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      paddingVertical: 4,
    },
    actions: {
      marginTop: Spacing.md,
    },
  });
}
