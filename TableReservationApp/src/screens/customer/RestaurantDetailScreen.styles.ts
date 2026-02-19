import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { ThemeColors } from '../../theme/themeUtils';

export function createRestaurantDetailStyles(colors: ThemeColors) {
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
    heroCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      alignItems: 'center',
      ...Shadow.medium,
      shadowColor: colors.shadow,
      marginBottom: Spacing.md,
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    restaurantName: {
      fontSize: FontSize.xxl,
      fontWeight: FontWeight.bold,
      color: colors.text,
      textAlign: 'center',
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.xs,
    },
    address: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      ...Shadow.small,
      shadowColor: colors.shadow,
      marginBottom: Spacing.md,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    infoLabel: {
      fontSize: FontSize.md,
      color: colors.textSecondary,
      flex: 1,
      marginLeft: Spacing.sm,
    },
    infoValue: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: colors.text,
    },
    ctaBtn: { marginTop: Spacing.md },
  });
}
