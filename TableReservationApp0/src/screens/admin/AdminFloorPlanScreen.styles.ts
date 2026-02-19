import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';
import { ThemeColors } from '../../theme/themeUtils';

export function createFloorPlanStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: { padding: Spacing.xs, marginRight: Spacing.sm },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: colors.text },
    content: { padding: Spacing.md },
    legend: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing.lg,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
    legendText: { fontSize: FontSize.sm, color: colors.textSecondary },
    grid: { gap: 8 },
    gridRow: { flexDirection: 'row', gap: 8 },
    tableCell: {
      width: 90,
      height: 70,
      borderRadius: BorderRadius.md,
      borderWidth: 2,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tableCellLabel: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: colors.text,
    },
    tableCellCapacity: {
      fontSize: FontSize.xs,
      color: colors.textSecondary,
      marginTop: 2,
    },
    emptyCell: {
      width: 90,
      height: 70,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.surfaceSecondary,
      opacity: 0.3,
    },
  });
}
