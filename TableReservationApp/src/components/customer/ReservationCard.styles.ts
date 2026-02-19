import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/layout';
import { ThemeColors } from '../../theme/themeUtils';

export function createReservationCardStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      ...Shadow.small,
      shadowColor: colors.shadow,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    restaurantName: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: colors.text,
      flex: 1,
      marginRight: Spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    detail: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      marginLeft: Spacing.xs,
    },
    chevron: {
      position: 'absolute',
      right: Spacing.md,
      bottom: Spacing.md,
    },
  });
}
