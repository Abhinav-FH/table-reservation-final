import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reservation } from '../../store/api/customerApi';
import { StatusBadge } from './StatusBadge';
import { styles } from './ReservationCard.styles';

interface ReservationCardProps {
  reservation: Reservation;
  isDark?: boolean;
  onPress?: () => void;
  onCancel?: () => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  isDark = false,
  onPress,
  onCancel,
}) => {
  const canCancel = reservation.status === 'PENDING' || reservation.status === 'CONFIRMED';
  const tableLabels = reservation.tables?.map((t) => t.label).join(', ') ?? '—';

  return (
    <TouchableOpacity
      style={[styles.card, isDark && styles.cardDark]}
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
    >
      {/* Date & Status row */}
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.date, isDark && styles.dateDark]}>
            {new Date(reservation.reservationDate).toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric',
            })}
          </Text>
          <Text style={[styles.time, isDark && styles.timeDark]}>
            {reservation.startTime} – {reservation.endTime}
          </Text>
        </View>
        <StatusBadge status={reservation.status} />
      </View>

      {/* Details row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={14} color={isDark ? '#8A7060' : '#9B876E'} />
          <Text style={[styles.detailText, isDark && styles.detailTextDark]}>
            {reservation.guestCount} guests
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="grid-outline" size={14} color={isDark ? '#8A7060' : '#9B876E'} />
          <Text style={[styles.detailText, isDark && styles.detailTextDark]}>
            {tableLabels}
          </Text>
        </View>
      </View>

      {/* Special requests */}
      {reservation.specialRequests ? (
        <Text style={[styles.special, isDark && styles.specialDark]} numberOfLines={1}>
          "{reservation.specialRequests}"
        </Text>
      ) : null}

      {/* Actions */}
      {canCancel && onCancel && (
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel reservation</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};