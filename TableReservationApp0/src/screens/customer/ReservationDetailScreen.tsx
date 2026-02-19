import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CustomerStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  fetchMyReservationByIdRequest,
  cancelReservationRequest,
} from '../../store/slices/reservationSlice';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AppButton } from '../../components/common/AppButton';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { useTheme } from '../../hooks/useTheme';
import { createDetailStyles } from './ReservationDetailScreen.styles';
import { dateUtils } from '../../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Spacing } from '../../constants/layout';

type Props = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'ReservationDetail'>;
  route: RouteProp<CustomerStackParamList, 'ReservationDetail'>;
};

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  borderColor: string;
  textSecondary: string;
  textColor: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, borderColor, textSecondary, textColor }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: borderColor }}>
    <Ionicons name={icon as any} size={16} color={textSecondary} style={{ marginRight: 10, marginTop: 2 }} />
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: FontSize.xs, color: textSecondary }}>{label}</Text>
      <Text style={{ fontSize: FontSize.md, color: textColor, marginTop: 2 }}>{value}</Text>
    </View>
  </View>
);

export const ReservationDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { reservationId } = route.params;
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { selected, isLoading } = useAppSelector((s) => s.reservation);
  const styles = createDetailStyles(colors);

  useEffect(() => {
    dispatch(fetchMyReservationByIdRequest(reservationId));
  }, [reservationId]);

  if (isLoading || !selected) return <LoadingOverlay fullScreen />;

  const canEdit = dateUtils.isEditable(selected.status);

  const handleCancel = () => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            dispatch(cancelReservationRequest(selected.id));
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Reservation Details</Text>
        <StatusBadge status={selected.status} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.restaurantName}>
            {selected.restaurant?.name ?? `Restaurant #${selected.restaurant_id}`}
          </Text>
          <Text style={styles.address}>{selected.restaurant?.address}</Text>
        </View>

        <View style={styles.card}>
          <InfoRow
            icon="calendar-outline"
            label="Date"
            value={dateUtils.formatDate(selected.reservation_date)}
            borderColor={colors.border}
            textSecondary={colors.textSecondary}
            textColor={colors.text}
          />
          <InfoRow
            icon="time-outline"
            label="Time"
            value={`${dateUtils.formatTime(selected.start_time)} – ${dateUtils.formatTime(selected.end_time)}`}
            borderColor={colors.border}
            textSecondary={colors.textSecondary}
            textColor={colors.text}
          />
          <InfoRow
            icon="people-outline"
            label="Guests"
            value={`${selected.guest_count} guests`}
            borderColor={colors.border}
            textSecondary={colors.textSecondary}
            textColor={colors.text}
          />
          {selected.special_requests ? (
            <InfoRow
              icon="chatbubble-outline"
              label="Special Requests"
              value={selected.special_requests}
              borderColor="transparent"
              textSecondary={colors.textSecondary}
              textColor={colors.text}
            />
          ) : null}
        </View>

        {selected.tables && selected.tables.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Assigned Tables</Text>
            {selected.tables.map((t) => (
              <Text key={t.id} style={styles.tableItem}>
                {t.label} – Capacity: {t.capacity}
              </Text>
            ))}
          </View>
        )}

        {canEdit && (
          <View style={styles.actions}>
            <AppButton
              label="Edit Reservation"
              variant="outline"
              fullWidth
              onPress={() => navigation.navigate('EditReservation', { reservationId: selected.id })}
            />
            <View style={{ height: 12 }} />
            <AppButton
              label="Cancel Reservation"
              variant="danger"
              fullWidth
              onPress={handleCancel}
              isLoading={isLoading}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
