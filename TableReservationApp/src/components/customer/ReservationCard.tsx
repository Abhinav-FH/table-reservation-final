import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reservation } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { useTheme } from '../../hooks/useTheme';
import { createReservationCardStyles } from './ReservationCard.styles';
import { dateUtils } from '../../utils/dateUtils';

interface ReservationCardProps {
  reservation: Reservation;
  onPress: () => void;
  showCustomer?: boolean;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onPress,
  showCustomer = false,
}) => {
  const { colors } = useTheme();
  const styles = createReservationCardStyles(colors);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Text style={styles.restaurantName} numberOfLines={1}>
          {reservation.restaurant?.name ?? `Restaurant #${reservation.restaurant_id}`}
        </Text>
        <StatusBadge status={reservation.status} />
      </View>

      {showCustomer && reservation.customer && (
        <View style={styles.row}>
          <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.detail}>{reservation.customer.name}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.detail}>{dateUtils.formatDate(reservation.reservation_date)}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.detail}>
          {dateUtils.formatTime(reservation.start_time)} – {dateUtils.formatTime(reservation.end_time)}
        </Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.detail}>{reservation.guest_count} guests</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={styles.chevron} />
    </TouchableOpacity>
  );
};
