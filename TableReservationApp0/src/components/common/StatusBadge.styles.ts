import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';

export function createStatusBadgeStyles(color: string, bgColor: string) {
  return StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: bgColor,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
      borderRadius: BorderRadius.full,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: color,
      marginRight: 5,
    },
    label: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color,
    },
  });
}
