import React, { useEffect, useState, useMemo } from 'react';
import {
  View, FlatList, SafeAreaView, RefreshControl, Text, TouchableOpacity, StyleSheet,
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
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';

type SortKey = 'newest' | 'oldest' | 'date_asc' | 'date_desc';

type Props = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerTabs'>;
};

const SORTS: Array<{ label: string; value: SortKey }> = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Date ↑', value: 'date_asc' },
  { label: 'Date ↓', value: 'date_desc' },
];

export const MyReservationsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { myList, isLoading, error } = useAppSelector((s) => s.reservation);
  const styles = createListScreenStyles(colors);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [showSort, setShowSort] = useState(false);

  // Fetch on mount — no filter so we get ALL reservations
  useEffect(() => { dispatch(fetchMyReservationsRequest()); }, []);

  const filtered = useMemo(() => {
    let list = [...(myList ?? [])];
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.restaurant?.name?.toLowerCase().includes(q) ||
        r.reservationDate?.includes(q)
      );
    }
    switch (sort) {
      case 'newest': list.sort((a, b) => b.id - a.id); break;
      case 'oldest': list.sort((a, b) => a.id - b.id); break;
      case 'date_asc': list.sort((a, b) => (a.reservationDate ?? '').localeCompare(b.reservationDate ?? '')); break;
      case 'date_desc': list.sort((a, b) => (b.reservationDate ?? '').localeCompare(a.reservationDate ?? '')); break;
    }
    return list;
  }, [myList, statusFilter, search, sort]);

  const onRefresh = () => { dispatch(fetchMyReservationsRequest()); };

  const s = StyleSheet.create({
    sortBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      paddingHorizontal: 12, paddingVertical: 7, borderRadius: BorderRadius.full,
    },
    sortDropdown: {
      marginHorizontal: Spacing.md, marginBottom: Spacing.xs,
      backgroundColor: colors.card, borderRadius: BorderRadius.lg,
      padding: Spacing.sm, borderWidth: 1, borderColor: colors.border,
      flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full },
  });

  const activeLabel = SORTS.find((o) => o.value === sort)?.label ?? 'Sort';

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View>
          <Text style={styles.heading}>My Reservations</Text>
          <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginTop: 1 }}>
            {filtered.length} reservation{filtered.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={[s.sortBtn, { backgroundColor: showSort ? Colors.primary : colors.surfaceSecondary }]}
          onPress={() => setShowSort(!showSort)}
        >
          <Ionicons name="swap-vertical-outline" size={14} color={showSort ? Colors.white : colors.text} />
          <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: showSort ? Colors.white : colors.text }}>
            {activeLabel}
          </Text>
        </TouchableOpacity>
      </View>

      {showSort && (
        <View style={s.sortDropdown}>
          {SORTS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[s.chip, { backgroundColor: sort === opt.value ? Colors.primary : colors.surfaceSecondary }]}
              onPress={() => { setSort(opt.value); setShowSort(false); }}
            >
              <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: sort === opt.value ? Colors.white : colors.text }}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {isLoading && (myList?.length ?? 0) === 0 ? (
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
          contentContainerStyle={[styles.list, filtered.length === 0 && { flex: 1 }]}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No reservations yet"
              message={error ? `Error: ${error}` : "Book a table from any restaurant to see it here."}
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