import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { ThemeColors } from '../../theme/themeUtils';

export function createTablesStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    // ── Header ──────────────────────────────────────────────
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
    subheading: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    // Row of icon buttons on the right of the header
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    iconBtn: {
      padding: 4,
    },

    // ── List ─────────────────────────────────────────────────
    list: {
      padding: Spacing.md,
      paddingTop: Spacing.xs,
      paddingBottom: 100,    // room above FAB
    },

    // ── Table row card ───────────────────────────────────────
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
    tableInfo: { flex: 1 },
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
    actionBtn: { padding: 6 },

    // ── FAB ──────────────────────────────────────────────────
    fab: {
      position: 'absolute',
      bottom: 28,
      right: 24,
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 10,
    },
  });
}