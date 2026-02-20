import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { ThemeColors } from '../../theme/themeUtils';

export function createDashboardStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    // ── Header ──────────────────────────────────────────────
    headerSection: {
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.md,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    greeting: {
      fontSize: FontSize.md,
      color: colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    restaurantName: {
      fontSize: FontSize.xxxl,
      fontWeight: FontWeight.bold,
      color: colors.text,
      marginTop: 4,
    },

    // ── No restaurant warning ────────────────────────────────
    noRestaurantCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: Colors.infoLight,
      marginHorizontal: Spacing.md,
      marginBottom: Spacing.md,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    noRestaurantText: {
      fontSize: FontSize.sm,
      color: Colors.info,
      flex: 1,
      lineHeight: 20,
    },

    // ── Today summary ────────────────────────────────────────
    summaryRow: {
      paddingHorizontal: Spacing.md,
      marginTop: Spacing.lg,
      marginBottom: Spacing.md,
    },
    summaryCard: {
      backgroundColor: Colors.primary,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      alignItems: 'center',
      ...Shadow.medium,
      shadowColor: Colors.primary,
    },
    summaryCardFull: {
      // full-width variant
    },
    summaryNumber: {
      fontSize: 48,
      fontWeight: FontWeight.bold,
      color: Colors.white,
      marginTop: Spacing.sm,
    },
    summaryLabel: {
      fontSize: FontSize.md,
      color: Colors.white,
      marginTop: 6,
      fontWeight: FontWeight.medium,
      opacity: 0.9,
    },

    // ── Status stats ─────────────────────────────────────────
    sectionTitle: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: colors.text,
      paddingHorizontal: Spacing.md,
      marginTop: Spacing.sm,
      marginBottom: Spacing.md,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: Spacing.md,
      gap: Spacing.md,
      paddingBottom: Spacing.xl,
    },
    statCard: {
      width: '47%',
      backgroundColor: colors.card,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      alignItems: 'center',
      ...Shadow.medium,
      shadowColor: colors.shadow,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statNumber: {
      fontSize: 32,
      fontWeight: FontWeight.bold,
      color: colors.text,
      marginTop: 8,
    },
    statLabel: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      marginTop: 4,
      fontWeight: FontWeight.semibold,
      textTransform: 'capitalize',
    },
  });
}