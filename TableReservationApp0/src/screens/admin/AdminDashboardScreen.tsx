import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList, ReservationStatus } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchAdminRestaurantRequest } from '../../store/slices/restaurantSlice';
import { fetchAdminReservationsRequest } from '../../store/slices/reservationSlice';
import { useTheme } from '../../hooks/useTheme';
import { createDashboardStyles } from './AdminDashboardScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminTabs'>;
};

const statuses: ReservationStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const STATUS_ICONS: Record<string, string> = {
  PENDING: 'hourglass-outline',
  CONFIRMED: 'checkmark-circle-outline',
  COMPLETED: 'trophy-outline',
  CANCELLED: 'close-circle-outline',
};

export const AdminDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { adminRestaurant, isLoading: rLoading } = useAppSelector((s) => s.restaurant);
  const { adminList, isLoading: resLoading } = useAppSelector((s) => s.reservation);
  const styles = createDashboardStyles(colors);

  const loading = rLoading || resLoading;

  useEffect(() => {
    dispatch(fetchAdminRestaurantRequest());
    dispatch(fetchAdminReservationsRequest());
  }, []);

  const onRefresh = () => {
    dispatch(fetchAdminRestaurantRequest());
    dispatch(fetchAdminReservationsRequest());
  };

  const countByStatus = (status: ReservationStatus) =>
    adminList.filter((r) => r.status === status).length;

  const todayReservations = adminList.filter(
    (r) => {
      const resDate = (r as any).reservationDate ?? (r as any).reservation_date ?? '';
      return resDate === new Date().toISOString().slice(0, 10);
    }
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        <View style={styles.headerSection}>
          <Text style={styles.greeting}>Good day 👋</Text>
          {adminRestaurant && (
            <Text style={styles.restaurantName}>{adminRestaurant.name}</Text>
          )}
        </View>

        {!adminRestaurant && !rLoading && (
          <View style={styles.noRestaurantCard}>
            <Ionicons name="storefront-outline" size={32} color={Colors.primary} />
            <Text style={styles.noRestaurantText}>No restaurant found. Create one in your profile.</Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.summaryCardFull]}>
            <Ionicons name="today-outline" size={24} color={Colors.primary} />
            <Text style={styles.summaryNumber}>{todayReservations}</Text>
            <Text style={styles.summaryLabel}>Today's Reservations</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Reservations by Status</Text>
        <View style={styles.statsGrid}>
          {statuses.map((status) => (
            <View key={status} style={styles.statCard}>
              <Ionicons name={STATUS_ICONS[status] as any} size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>{countByStatus(status)}</Text>
              <Text style={styles.statLabel}>{status.toLowerCase()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
