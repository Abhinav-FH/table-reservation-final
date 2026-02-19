import { StyleSheet } from 'react-native';
import { FontSize, Spacing } from '../../constants/layout';
import { ThemeColors } from '../../theme/themeUtils';

export function createLoadingStyles(colors: ThemeColors, fullScreen: boolean) {
  return StyleSheet.create({
    container: {
      flex: fullScreen ? 1 : undefined,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.xl,
      backgroundColor: fullScreen ? colors.background : 'transparent',
    },
    message: {
      marginTop: Spacing.md,
      fontSize: FontSize.md,
      color: colors.textSecondary,
    },
  });
}
