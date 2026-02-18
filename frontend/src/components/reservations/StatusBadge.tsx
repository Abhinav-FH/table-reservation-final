import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './StatusBadge.styles';

type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

interface StatusBadgeProps {
  status: Status;
}

const STATUS_LABELS: Record<Status, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <View style={[styles.badge, styles[`badge${status}`]]}>
    <View style={[styles.dot, styles[`dot${status}`]]} />
    <Text style={[styles.text, styles[`text${status}`]]}>{STATUS_LABELS[status]}</Text>
  </View>
);