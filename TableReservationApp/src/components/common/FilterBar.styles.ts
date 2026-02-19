import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { ThemeColors } from '../../theme/themeUtils';

export function createFilterBarStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 8,
      marginBottom: Spacing.sm,
    },
    searchIcon: {
      marginRight: Spacing.xs,
    },
    searchInput: {
      flex: 1,
      fontSize: FontSize.sm,
      color: colors.text,
    },
    pillsRow: {
      flexDirection: 'row',
    },
    pill: {
      paddingHorizontal: Spacing.md,
      paddingVertical: 6,
      borderRadius: BorderRadius.full,
      backgroundColor: colors.surfaceSecondary,
      marginRight: Spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pillActive: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    pillText: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    pillTextActive: {
      color: Colors.white,
    },
  });
}
