import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { createButtonStyles } from './AppButton.styles';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  style,
  disabled,
  ...rest
}) => {
  const { colors } = useTheme();
  const styles = createButtonStyles(colors, variant, size, fullWidth);
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.disabled, style as ViewStyle]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFF' : colors.text}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.label, leftIcon ? styles.labelWithIcon : null]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
