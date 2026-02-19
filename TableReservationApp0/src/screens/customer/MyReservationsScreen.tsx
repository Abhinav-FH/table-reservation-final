import React, { useEffect, useState } from 'react';
import {
  View, FlatList, SafeAreaView, RefreshControl, Text,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerStackParamList, ReservationStatus } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchMyReservationsRequest } from '../../store/slices/reservationSlice';
import { ReservationCard } from '../../components/customer/ReservationCard';
import { FilterBar } from '../../components/common/FilterBar';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { EmptyState } from '../../components/common/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { createListScreenStyles } from './MyReservationsScreen.styles';
import { Colors } from '../../constants/colors';
import { AppButton } from '../../components/common/AppButton';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerTabs'>;
};

export const MyReservationsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { myList, isLoading } = useAppSelector((s) => s.reservation);
  const styles = createListScreenStyles(colors);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');

  useEffect(() => { dispatch(fetchMyReservationsRequest()); }, []);

  const filtered = myList.filter((r) => {
    const matchesStatus = !statusFilter || r.status === statusFilter;
    const matchesSearch =
      !search ||
      r.restaurant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.reservation_date.includes(search);
    return matchesStatus && matchesSearch;
  });

  const onRefresh = () => {
    dispatch(fetchMyReservationsRequest(statusFilter ? { status: statusFilter } : undefined));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>My Reservations</Text>
      </View>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {isLoading && myList.length === 0 ? (
        <LoadingOverlay />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ReservationCard
              reservation={item}
              onPress={() => navigation.navigate('ReservationDetail', { reservationId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No reservations"
              message="You haven't made any reservations yet."
              actionLabel="Browse Restaurants"
              onAction={() => (navigation as any).navigate('HomeTab')}
            />
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        />
      )}
    </SafeAreaView>
  );
};
