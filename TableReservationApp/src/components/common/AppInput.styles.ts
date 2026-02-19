import { StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { ThemeColors } from '../../theme/themeUtils';

export function createInputStyles(colors: ThemeColors, isFocused: boolean, hasError: boolean) {
  const borderColor = hasError ? Colors.error : isFocused ? colors.borderFocus : colors.border;

  return StyleSheet.create({
    container: {
      marginBottom: Spacing.md,
    },
    label: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: colors.textSecondary,
      marginBottom: Spacing.xs,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      borderColor,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: Spacing.md,
      fontSize: FontSize.md,
      color: colors.text,
    },
    leftIcon: {
      marginLeft: Spacing.md,
    },
    rightIconBtn: {
      padding: Spacing.md,
    },
    errorText: {
      marginTop: Spacing.xs,
      fontSize: FontSize.xs,
      color: Colors.error,
    },
  });
}
