import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, FlatList, SafeAreaView, RefreshControl,
  TouchableOpacity, StyleSheet,
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
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';

type SortKey = 'newest' | 'oldest' | 'date_asc' | 'date_desc';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminTabs'>;
};

const SORTS: Array<{ label: string; value: SortKey }> = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Date ↑', value: 'date_asc' },
  { label: 'Date ↓', value: 'date_desc' },
];

export const AdminReservationsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { adminList, isLoading } = useAppSelector((s) => s.reservation);
  const styles = createListScreenStyles(colors);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => { dispatch(fetchAdminReservationsRequest()); }, []);

  const filtered = useMemo(() => {
    let list = [...adminList];
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => {
        const res = r as any;
        const resDate = res.reservationDate ?? res.reservation_date ?? '';
        return r.customer?.name?.toLowerCase().includes(q) ||
          r.customer?.email?.toLowerCase().includes(q) ||
          r.restaurant?.name?.toLowerCase().includes(q) ||
          resDate.includes(q);
      });
    }
    switch (sort) {
      case 'newest': list.sort((a, b) => Number(b.id) - Number(a.id)); break;
      case 'oldest': list.sort((a, b) => Number(a.id) - Number(b.id)); break;
      case 'date_asc': {
        list.sort((a, b) => {
          const aDate = (a as any).reservationDate ?? (a as any).reservation_date ?? '';
          const bDate = (b as any).reservationDate ?? (b as any).reservation_date ?? '';
          return aDate.localeCompare(bDate);
        });
        break;
      }
      case 'date_desc': {
        list.sort((a, b) => {
          const aDate = (a as any).reservationDate ?? (a as any).reservation_date ?? '';
          const bDate = (b as any).reservationDate ?? (b as any).reservation_date ?? '';
          return bDate.localeCompare(aDate);
        });
        break;
      }
    }
    return list;
  }, [adminList, statusFilter, search, sort]);

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
    chipTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
    fab: {
      position: 'absolute', bottom: 28, right: 24,
      width: 58, height: 58, borderRadius: 29,
      backgroundColor: Colors.primary,
      justifyContent: 'center', alignItems: 'center',
      shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
    },
  });

  const activeLabel = SORTS.find((o) => o.value === sort)?.label ?? 'Sort';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header row — heading left, sort right (replaces your old + button here) */}
      <View style={[styles.headerRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.heading}>Reservations</Text>
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

      {/* Sort chips */}
      {showSort && (
        <View style={s.sortDropdown}>
          {SORTS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[s.chip, { backgroundColor: sort === opt.value ? Colors.primary : colors.surfaceSecondary }]}
              onPress={() => { setSort(opt.value); setShowSort(false); }}
            >
              <Text style={[s.chipTxt, { color: sort === opt.value ? Colors.white : colors.text }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Your existing FilterBar — unchanged */}
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
          keyExtractor={(item) => String(item?.id ?? Math.random())}
          renderItem={({ item }) => (
            <ReservationCard
              reservation={item}
              showCustomer
              onPress={() => navigation.navigate('AdminReservationDetail', { reservationId: item.id })}
            />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: 100 }]}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No reservations"
              message="No reservations match your filters."
            />
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

      {/* FAB — bottom right instead of top right */}
      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate('AdminNewReservation')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};