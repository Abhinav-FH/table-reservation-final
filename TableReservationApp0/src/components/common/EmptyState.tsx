import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { createEmptyStateStyles } from './EmptyState.styles';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'calendar-outline',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const { colors } = useTheme();
  const styles = createEmptyStateStyles(colors);

  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={64} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <AppButton label={actionLabel} onPress={onAction} style={styles.button} />
      )}
    </View>
  );
};
