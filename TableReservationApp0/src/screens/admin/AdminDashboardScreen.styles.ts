import { StyleSheet, Dimensions } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { ThemeColors } from '../../theme/themeUtils';

const { width } = Dimensions.get('window');

export function createDashboardStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerSection: {
      padding: Spacing.md,
      paddingBottom: Spacing.sm,
    },
    greeting: {
      fontSize: FontSize.md,
      color: colors.textSecondary,
    },
    restaurantName: {
      fontSize: FontSize.xxl,
      fontWeight: FontWeight.bold,
      color: colors.text,
      marginTop: 2,
    },
    noRestaurantCard: {
      margin: Spacing.md,
      padding: Spacing.lg,
      backgroundColor: Colors.errorLight,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
    },
    noRestaurantText: {
      fontSize: FontSize.sm,
      color: Colors.primary,
      textAlign: 'center',
      marginTop: Spacing.sm,
    },
    summaryRow: {
      paddingHorizontal: Spacing.md,
      marginBottom: Spacing.sm,
    },
    summaryCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      alignItems: 'center',
      ...Shadow.small,
      shadowColor: colors.shadow,
    },
    summaryCardFull: {
      width: '100%',
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
    sectionTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: colors.text,
      paddingHorizontal: Spacing.md,
      marginTop: Spacing.md,
      marginBottom: Spacing.sm,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: Spacing.sm,
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    statCard: {
      width: (width - Spacing.sm * 3 - Spacing.sm * 2) / 2,
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      alignItems: 'center',
      ...Shadow.small,
      shadowColor: colors.shadow,
    },
    statNumber: {
      fontSize: FontSize.xxl,
      fontWeight: FontWeight.bold,
      color: colors.text,
      marginTop: Spacing.xs,
    },
    statLabel: {
      fontSize: FontSize.xs,
      color: colors.textSecondary,
      marginTop: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  });
}
