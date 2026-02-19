import React from 'react';
import { View, Text } from 'react-native';
import { createStatusBadgeStyles } from './StatusBadge.styles';
import { getStatusColor, getStatusBgColor } from '../../theme/themeUtils';
import { useTheme } from '../../hooks/useTheme';

interface StatusBadgeProps {
  status: string;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { mode } = useTheme();
  const color = getStatusColor(status, mode);
  const bgColor = getStatusBgColor(status);
  const styles = createStatusBadgeStyles(color, bgColor);

  return (
    <View style={styles.badge}>
      <View style={styles.dot} />
      <Text style={styles.label}>{STATUS_LABEL[status] ?? status}</Text>
    </View>
  );
};
