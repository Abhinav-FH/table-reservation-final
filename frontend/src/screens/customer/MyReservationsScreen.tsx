import React, { useState } from 'react';
import {
  View, Text, FlatList, SafeAreaView, StatusBar, RefreshControl, Alert,
} from 'react-native';
import { useGetMyReservationsQuery, useCancelReservationMutation } from '../../store/api/customerApi';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { logout } from '../../store/slices/authSlice';
import { ReservationCard } from '../../components/reservations/ReservationCard';
import { styles } from './MyReservationsScreen.styles';
import { Colors } from '../../styles/colors';

const STATUS_FILTERS = ['All', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;

export const MyReservationsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const { data, isLoading, refetch } = useGetMyReservationsQuery(
    activeFilter === 'All' ? undefined : { status: activeFilter }
  );

  const [cancelReservation] = useCancelReservationMutation();

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Reservation', 'Are you sure you want to cancel?', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel It',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelReservation(id).unwrap();
          } catch {
            Alert.alert('Error', 'Could not cancel reservation.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgBase} />
      <FlatList
        data={data?.data ?? []}
        keyExtractor={(r) => r.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>My Bookings</Text>
            {/* Filter tabs */}
            <FlatList
              horizontal
              data={STATUS_FILTERS}
              keyExtractor={(s) => s}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View
                  style={[styles.filterTab, activeFilter === item && styles.filterTabActive]}
                >
                  <Text
                    style={[styles.filterText, activeFilter === item && styles.filterTextActive]}
                    onPress={() => setActiveFilter(item)}
                  >
                    {item === 'All' ? 'All' : item.charAt(0) + item.slice(1).toLowerCase()}
                  </Text>
                </View>
              )}
              style={styles.filterRow}
            />
          </View>
        }
        renderItem={({ item }) => (
          <ReservationCard
            reservation={item}
            onCancel={() => handleCancel(item.id)}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyTitle}>No reservations yet</Text>
              <Text style={styles.emptyDesc}>Go to Explore and book your first table.</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};