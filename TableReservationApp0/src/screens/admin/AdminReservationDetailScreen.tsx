import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AdminStackParamList, ReservationStatus } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  fetchAdminReservationByIdRequest,
  adminUpdateStatusRequest,
  adminCancelReservationRequest,
} from '../../store/slices/reservationSlice';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AppButton } from '../../components/common/AppButton';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { useTheme } from '../../hooks/useTheme';
import { createDetailStyles } from '../customer/ReservationDetailScreen.styles';
import { dateUtils } from '../../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, Spacing } from '../../constants/layout';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminReservationDetail'>;
  route: RouteProp<AdminStackParamList, 'AdminReservationDetail'>;
};

const STATUS_TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
  borderColor: string;
  textSecondary: string;
  textColor: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, borderColor, textSecondary, textColor }) => (
  <View style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: borderColor }}>
    <Ionicons name={icon as any} size={16} color={textSecondary} style={{ marginRight: 10, marginTop: 2 }} />
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: FontSize.xs, color: textSecondary }}>{label}</Text>
      <Text style={{ fontSize: FontSize.md, color: textColor, marginTop: 2 }}>{value}</Text>
    </View>
  </View>
);

export const AdminReservationDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { reservationId } = route.params;
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { selected, isLoading } = useAppSelector((s) => s.reservation);
  const styles = createDetailStyles(colors);

  useEffect(() => {
    dispatch(fetchAdminReservationByIdRequest(reservationId));
  }, [reservationId]);

  // Only show full-screen loader on initial load — NOT during status updates.
  // If we show LoadingOverlay when isLoading=true, the screen disappears while
  // the status update request is in-flight, making it look like nothing happened.
  if (!selected) return <LoadingOverlay fullScreen />;

  const transitions = STATUS_TRANSITIONS[selected.status] ?? [];

  const handleStatusChange = (status: ReservationStatus) => {
    Alert.alert('Update Status', `Change status to "${status}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => {
          dispatch(adminUpdateStatusRequest({ id: selected.id, status }));
        },
      },
    ]);
  };

  const handleCancel = () => {
    Alert.alert('Cancel Reservation', 'Are you sure you want to cancel this reservation?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () => {
          dispatch(adminCancelReservationRequest(selected.id));
          navigation.goBack();
        },
      },
    ]);
  };

  const statusColor: Record<ReservationStatus, string> = {
    PENDING: '#F59E0B',
    CONFIRMED: Colors.success,
    COMPLETED: colors.textSecondary,
    CANCELLED: Colors.error,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Reservation #{selected.id}</Text>
        <StatusBadge status={selected.status} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Customer info */}
        {selected.customer && (
          <View style={styles.card}>
            <Text style={{ fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: colors.text, marginBottom: Spacing.sm }}>
              Customer
            </Text>
            <Text style={{ color: colors.text, fontWeight: FontWeight.medium }}>{selected.customer.name}</Text>
            <Text style={{ color: colors.textSecondary, marginTop: 2 }}>{selected.customer.email}</Text>
            {selected.customer.phone ? <Text style={{ color: colors.textSecondary, marginTop: 2 }}>{selected.customer.phone}</Text> : null}
          </View>
        )}

        {/* Restaurant */}
        <View style={styles.card}>
          <Text style={{ fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: colors.text, marginBottom: 2 }}>
            {selected.restaurant?.name ?? `Restaurant #${selected.restaurantId}`}
          </Text>
          {selected.restaurant?.address ? <Text style={{ color: colors.textSecondary }}>{selected.restaurant.address}</Text> : null}
        </View>

        {/* Reservation details */}
        <View style={styles.card}>
          <InfoItem icon="calendar-outline" label="Date" value={dateUtils.formatDate(selected.reservationDate)} borderColor={colors.border} textSecondary={colors.textSecondary} textColor={colors.text} />
          <InfoItem icon="time-outline" label="Time" value={`${dateUtils.formatTime(selected.startTime)} – ${dateUtils.formatTime(selected.endTime)}`} borderColor={colors.border} textSecondary={colors.textSecondary} textColor={colors.text} />
          <InfoItem icon="people-outline" label="Guests" value={`${selected.guestCount} guests`} borderColor={selected.specialRequests ? colors.border : 'transparent'} textSecondary={colors.textSecondary} textColor={colors.text} />
          {selected.specialRequests ? (
            <InfoItem icon="chatbubble-outline" label="Special Requests" value={selected.specialRequests} borderColor="transparent" textSecondary={colors.textSecondary} textColor={colors.text} />
          ) : null}
        </View>

        {/* Status update — keep screen visible, show inline spinner during update */}
        {transitions.length > 0 && (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}>
              <Text style={{ fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: colors.text }}>
                Update Status
              </Text>
              {isLoading && (
                <ActivityIndicator size="small" color={Colors.primary} style={{ marginLeft: 10 }} />
              )}
            </View>
            <Text style={{ fontSize: FontSize.xs, color: colors.textMuted, marginBottom: Spacing.md }}>
              Current: <Text style={{ color: statusColor[selected.status], fontWeight: FontWeight.semibold }}>{selected.status}</Text>
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
              {transitions.map((status) => (
                <AppButton
                  key={status}
                  label={status}
                  size="sm"
                  variant={status === 'CANCELLED' ? 'danger' : 'primary'}
                  onPress={() => handleStatusChange(status)}
                  disabled={isLoading}  // disable (not hide) during request
                />
              ))}
            </View>
          </View>
        )}

        {/* Edit button */}
        {selected.status !== 'CANCELLED' && selected.status !== 'COMPLETED' && (
          <View style={{ marginTop: Spacing.sm, gap: 10 }}>
            <AppButton
              label="Edit Reservation"
              variant="outline"
              fullWidth
              onPress={() => navigation.navigate('AdminEditReservation', { reservationId: selected.id })}
              disabled={isLoading}
            />
            <AppButton
              label="Cancel Reservation"
              variant="danger"
              fullWidth
              onPress={handleCancel}
              disabled={isLoading}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};