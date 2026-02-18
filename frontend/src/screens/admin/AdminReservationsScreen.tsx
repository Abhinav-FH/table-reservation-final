import React, { useState } from 'react';
import {
  View, Text, FlatList, SafeAreaView, StatusBar, TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AdminReservationsStackParams } from '../../navigation/AdminNavigator';
import {
  useListAdminReservationsQuery,
  useAdminUpdateStatusMutation,
  useAdminCancelReservationMutation,
} from '../../store/api/adminApi';
import { ReservationCard } from '../../components/reservations/ReservationCard';
import { styles } from './AdminReservationsScreen.styles';
import { Colors } from '../../styles/colors';

type NavProp = StackNavigationProp<AdminReservationsStackParams, 'AdminReservations'>;

const STATUS_FILTERS = ['All', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;

export const AdminReservationsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [activeFilter, setActiveFilter] = useState('All');

  const { data, isLoading, refetch } = useListAdminReservationsQuery(
    activeFilter === 'All' ? {} : { status: activeFilter }
  );
  const [updateStatus] = useAdminUpdateStatusMutation();
  const [cancelReservation] = useAdminCancelReservationMutation();

  const handleStatusChange = (id: string, status: string) => {
    Alert.alert('Update Status', `Set to ${status}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            await updateStatus({ id, status }).unwrap();
          } catch (err: any) {
            Alert.alert('Error', err?.data?.error?.message ?? 'Could not update.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <FlatList
        data={data?.data ?? []}
        keyExtractor={(r) => r.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.primary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Reservations</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => navigation.navigate('AdminCreateReservation')}
              >
                <Ionicons name="add" size={22} color={Colors.primary} />
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
            />
          </View>
        }
        renderItem={({ item }) => (
          <ReservationCard
            reservation={item}
            isDark
            onCancel={() => handleStatusChange(item.id, 'CANCELLED')}
            onPress={() => {}} // Could navigate to detail screen
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No reservations found.</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};