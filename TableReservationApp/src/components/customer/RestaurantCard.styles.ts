import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { ThemeColors } from '../../theme/themeUtils';

export function createRestaurantCardStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      ...Shadow.small,
      shadowColor: colors.shadow,
    },
    iconContainer: {
      width: 52,
      height: 52,
      borderRadius: BorderRadius.md,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    content: {
      flex: 1,
    },
    name: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: colors.text,
      marginBottom: 3,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    address: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      marginLeft: 4,
      flex: 1,
    },
    tableCount: {
      fontSize: FontSize.sm,
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });
}
