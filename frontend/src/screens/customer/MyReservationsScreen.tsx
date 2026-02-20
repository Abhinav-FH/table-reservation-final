import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetMyReservationsQuery, useCancelReservationMutation, Reservation } from '../../store/api/customerApi';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { logout } from '../../store/slices/authSlice';
import { StatusBadge } from '../../components/reservations/StatusBadge';
import { styles } from './MyReservationsScreen.styles';
import { Colors } from '../../styles/colors';

const STATUS_FILTERS = ['All', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;

// ── Reservation card with restaurant info ─────────────────────────────────────
const BookingCard: React.FC<{
  reservation: Reservation;
  onCancel?: () => void;
}> = ({ reservation, onCancel }) => {
  const r = reservation as any; // restaurant may be nested

  const restaurantName = r.restaurant?.name ?? r.restaurantName ?? 'Restaurant';
  const restaurantAddress = r.restaurant?.address ?? r.restaurantAddress ?? '';
  const dateStr = new Date(reservation.reservationDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  });
  const tables = reservation.tables ?? [];
  const canCancel = reservation.status === 'PENDING' || reservation.status === 'CONFIRMED';

  return (
    <View style={styles.card}>
      {/* Restaurant info row */}
      <View style={styles.cardRestaurantRow}>
        <View style={styles.cardRestaurantIcon}>
          <Ionicons name="restaurant" size={14} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardRestaurantName} numberOfLines={1}>
            {restaurantName}
          </Text>
          {!!restaurantAddress && (
            <Text style={styles.cardRestaurantAddress} numberOfLines={1}>
              {restaurantAddress}
            </Text>
          )}
        </View>
        <StatusBadge status={reservation.status} />
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Booking details */}
      <View style={styles.cardDetails}>
        <View style={styles.cardDetailItem}>
          <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.cardDetailText}>{dateStr}</Text>
        </View>
        <View style={styles.cardDetailItem}>
          <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.cardDetailText}>
            {reservation.startTime} – {reservation.endTime}
          </Text>
        </View>
        <View style={styles.cardDetailItem}>
          <Ionicons name="people-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.cardDetailText}>
            {reservation.guestCount} guest{reservation.guestCount !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Tables assigned */}
      {tables.length > 0 && (
        <View style={styles.cardTablesRow}>
          <Text style={styles.cardTablesLabel}>Tables: </Text>
          <Text style={styles.cardTablesValue}>
            {tables.map((t: any) => t.label).join(', ')}
          </Text>
        </View>
      )}

      {/* Special requests */}
      {!!reservation.specialRequests && (
        <View style={styles.cardRequestRow}>
          <Ionicons name="chatbubble-ellipses-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.cardRequestText} numberOfLines={2}>
            {reservation.specialRequests}
          </Text>
        </View>
      )}


      {/* Cancel action */}
      {canCancel && onCancel && (
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>Cancel Reservation</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ── Screen ────────────────────────────────────────────────────────────────────
export const MyReservationsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const { data, isLoading, refetch } = useGetMyReservationsQuery(
    activeFilter === 'All' ? undefined : { status: activeFilter },
  );

  const [cancelReservation] = useCancelReservationMutation();

  const reservations: Reservation[] = data?.data ?? [];

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Reservation', 'Are you sure you want to cancel this booking?', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel It',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelReservation(id).unwrap();
            refetch();
          } catch {
            Alert.alert('Error', 'Could not cancel reservation.');
          }
        },
      },
    ]);
  };
  const newHeader = () => {
    const bookingCount = reservations.length;
    const totalGuests = reservations.reduce((sum, r) => sum + r.guestCount, 0);
    <>
      <Text >{bookingCount} bookings</Text>
      <View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
          <Ionicons name="log-out-outline" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </>

  };
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.title}>My Bookings</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
          <Ionicons name="log-out-outline" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <FlatList
        horizontal
        data={STATUS_FILTERS}
        keyExtractor={(s) => s}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterTab, activeFilter === item && styles.filterTabActive]}
            onPress={() => setActiveFilter(item)}
          >
            <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
              {item === 'All' ? 'All' : item.charAt(0) + item.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.filterRow}
        contentContainerStyle={{ gap: 8, paddingRight: 16 }}
      />

      <Text style={styles.resultsCount}>
        {reservations.length} booking{reservations.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgBase} />
      <FlatList
        data={reservations}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.primary} />
        }
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <BookingCard
            reservation={item}
            onCancel={
              item.status === 'PENDING' || item.status === 'CONFIRMED'
                ? () => handleCancel(item.id)
                : undefined
            }
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.emptyDesc}>
                {activeFilter !== 'All'
                  ? `No ${activeFilter.toLowerCase()} reservations found.`
                  : 'Head to Explore to find a restaurant and make your first reservation.'}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};