import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert,
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

  if (isLoading || !selected) return <LoadingOverlay fullScreen />;

  const transitions = STATUS_TRANSITIONS[selected.status] ?? [];

  const handleStatusChange = (status: ReservationStatus) => {
    Alert.alert('Update Status', `Change status to ${status}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => dispatch(adminUpdateStatusRequest({ id: selected.id, status })),
      },
    ]);
  };

  const handleCancel = () => {
    Alert.alert('Cancel Reservation', 'Are you sure?', [
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
        {selected.customer && (
          <View style={styles.card}>
            <Text style={{ fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: colors.text, marginBottom: Spacing.sm }}>
              Customer Info
            </Text>
            <Text style={{ color: colors.text, marginBottom: 2 }}>{selected.customer.name}</Text>
            <Text style={{ color: colors.textSecondary, marginBottom: 2 }}>{selected.customer.email}</Text>
            <Text style={{ color: colors.textSecondary }}>{selected.customer.phone}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={{ fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: colors.text, marginBottom: 4 }}>
            {selected.restaurant?.name ?? `Restaurant #${selected.restaurant_id}`}
          </Text>
          <Text style={{ color: colors.textSecondary }}>{selected.restaurant?.address}</Text>
        </View>

        <View style={styles.card}>
          <InfoItem icon="calendar-outline" label="Date" value={dateUtils.formatDate(selected.reservation_date)} borderColor={colors.border} textSecondary={colors.textSecondary} textColor={colors.text} />
          <InfoItem icon="time-outline" label="Time" value={`${dateUtils.formatTime(selected.start_time)} – ${dateUtils.formatTime(selected.end_time)}`} borderColor={colors.border} textSecondary={colors.textSecondary} textColor={colors.text} />
          <InfoItem icon="people-outline" label="Guests" value={`${selected.guest_count} guests`} borderColor={selected.special_requests ? colors.border : 'transparent'} textSecondary={colors.textSecondary} textColor={colors.text} />
          {selected.special_requests ? (
            <InfoItem icon="chatbubble-outline" label="Special Requests" value={selected.special_requests} borderColor="transparent" textSecondary={colors.textSecondary} textColor={colors.text} />
          ) : null}
        </View>

        {transitions.length > 0 && (
          <View style={[styles.card, { gap: 8 }]}>
            <Text style={{ fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: colors.text, marginBottom: Spacing.sm }}>
              Update Status
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {transitions.map((status) => (
                <AppButton
                  key={status}
                  label={status}
                  size="sm"
                  variant={status === 'CANCELLED' ? 'danger' : 'primary'}
                  onPress={() => handleStatusChange(status)}
                  isLoading={isLoading}
                />
              ))}
            </View>
          </View>
        )}

        {selected.status !== 'CANCELLED' && selected.status !== 'COMPLETED' && (
          <View style={{ marginTop: Spacing.sm }}>
            <AppButton
              label="Edit Reservation"
              variant="outline"
              fullWidth
              onPress={() => navigation.navigate('AdminEditReservation', { reservationId: selected.id })}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
