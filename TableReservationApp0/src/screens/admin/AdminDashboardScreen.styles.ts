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
      paddingTop: Spacing.md,
      paddingBottom: Spacing.sm,
    },
    greeting: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
    },
    restaurantName: {
      fontSize: FontSize.xxl,
      fontWeight: FontWeight.bold,
      color: colors.text,
      marginTop: 2,
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
      marginBottom: Spacing.md,
    },
    summaryCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      alignItems: 'center',
      ...Shadow.small,
      shadowColor: colors.shadow,
    },
    summaryCardFull: {
      // full-width variant — used as [styles.summaryCard, styles.summaryCardFull]
    },
    summaryNumber: {
      fontSize: 40,
      fontWeight: FontWeight.bold,
      color: colors.text,
      marginTop: Spacing.sm,
    },
    summaryLabel: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      marginTop: 4,
    },

    // ── Status stats ─────────────────────────────────────────
    sectionTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: colors.text,
      paddingHorizontal: Spacing.md,
      marginBottom: Spacing.sm,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: Spacing.sm,
      gap: Spacing.sm,
      paddingBottom: Spacing.xl,
    },
    statCard: {
      // Each card is ~half width minus gap
      width: '47%',
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      alignItems: 'center',
      marginHorizontal: '1.5%',
      ...Shadow.small,
      shadowColor: colors.shadow,
    },
    statNumber: {
      fontSize: FontSize.xxl,
      fontWeight: FontWeight.bold,
      color: colors.text,
      marginTop: 6,
    },
    statLabel: {
      fontSize: FontSize.xs,
      color: colors.textSecondary,
      marginTop: 2,
      fontWeight: FontWeight.medium,
    },
  });
}