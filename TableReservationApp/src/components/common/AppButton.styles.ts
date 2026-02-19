import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';
import { ThemeColors } from '../../theme/themeUtils';

export function createButtonStyles(
  colors: ThemeColors,
  variant: string,
  size: string,
  fullWidth: boolean,
) {
  const sizeMap = {
    sm: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, fontSize: FontSize.sm },
    md: { paddingVertical: 12, paddingHorizontal: Spacing.lg, fontSize: FontSize.md },
    lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, fontSize: FontSize.lg },
  };
  const s = sizeMap[size as keyof typeof sizeMap] || sizeMap.md;

  const bgMap: Record<string, string> = {
    primary: Colors.primary,
    outline: 'transparent',
    ghost: 'transparent',
    danger: Colors.error,
  };

  const textColorMap: Record<string, string> = {
    primary: Colors.white,
    outline: Colors.primary,
    ghost: colors.text,
    danger: Colors.white,
  };

  const borderMap: Record<string, string> = {
    primary: Colors.primary,
    outline: Colors.primary,
    ghost: 'transparent',
    danger: Colors.error,
  };

  return StyleSheet.create({
    button: {
      backgroundColor: bgMap[variant],
      borderRadius: BorderRadius.md,
      borderWidth: variant === 'outline' ? 1.5 : 0,
      borderColor: borderMap[variant],
      paddingVertical: s.paddingVertical,
      paddingHorizontal: s.paddingHorizontal,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : undefined,
      minHeight: size === 'sm' ? 36 : 48,
    },
    label: {
      color: textColorMap[variant],
      fontSize: s.fontSize,
      fontWeight: FontWeight.semibold,
      textAlign: 'center',
    },
    labelWithIcon: {
      marginLeft: Spacing.xs,
    },
    disabled: {
      opacity: 0.55,
    },
  });
}
