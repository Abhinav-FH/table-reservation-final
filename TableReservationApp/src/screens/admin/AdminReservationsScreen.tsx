import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, SafeAreaView, RefreshControl, TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList, ReservationStatus } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchAdminReservationsRequest } from '../../store/slices/reservationSlice';
import { ReservationCard } from '../../components/customer/ReservationCard';
import { FilterBar } from '../../components/common/FilterBar';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { EmptyState } from '../../components/common/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { createListScreenStyles } from '../customer/MyReservationsScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminTabs'>;
};

export const AdminReservationsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { adminList, isLoading } = useAppSelector((s) => s.reservation);
  const styles = createListScreenStyles(colors);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');

  useEffect(() => { dispatch(fetchAdminReservationsRequest()); }, []);

  const filtered = adminList.filter((r) => {
    const matchesStatus = !statusFilter || r.status === statusFilter;
    const matchesSearch =
      !search ||
      r.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.restaurant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.reservation_date.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.heading}>Reservations</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AdminNewReservation')}>
          <Ionicons name="add-circle" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {isLoading && adminList.length === 0 ? (
        <LoadingOverlay />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ReservationCard
              reservation={item}
              showCustomer
              onPress={() => navigation.navigate('AdminReservationDetail', { reservationId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState icon="calendar-outline" title="No reservations" message="No reservations match your filters." />
          }
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => dispatch(fetchAdminReservationsRequest(statusFilter ? { status: statusFilter } : undefined))}
              tintColor={Colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};
