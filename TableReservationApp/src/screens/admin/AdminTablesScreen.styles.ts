import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/layout';
import { ThemeColors } from '../../theme/themeUtils';

export function createTablesStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.sm,
    },
    heading: {
      fontSize: FontSize.xxl,
      fontWeight: FontWeight.bold,
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    iconBtn: {
      padding: 4,
    },
    list: {
      padding: Spacing.md,
      paddingTop: Spacing.xs,
      flexGrow: 1,
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      ...Shadow.small,
      shadowColor: colors.shadow,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: Spacing.md,
    },
    tableInfo: {
      flex: 1,
    },
    tableLabel: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: colors.text,
    },
    tableMeta: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    tableStatus: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      marginTop: 2,
    },
    tableActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    actionBtn: {
      padding: 6,
    },
  });
}
