import { StyleSheet } from 'react-native';
import { FontSize, FontWeight, Spacing } from '../../constants/layout';
import { ThemeColors } from '../../theme/themeUtils';

export function createListScreenStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerRow: {
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.sm,
    },
    heading: {
      fontSize: FontSize.xxl,
      fontWeight: FontWeight.bold,
      color: colors.text,
    },
    list: {
      padding: Spacing.md,
      paddingTop: Spacing.sm,
      flexGrow: 1,
    },
  });
}
