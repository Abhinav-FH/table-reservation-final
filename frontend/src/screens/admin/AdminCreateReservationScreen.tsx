import React, { useState } from 'react';
import {
  View, Text, ScrollView, Alert, SafeAreaView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useGetFloorPlanQuery, useAdminCreateReservationMutation, FloorPlanTable } from '../../store/api/adminApi';
import { useGetAdminRestaurantQuery } from '../../store/api/adminApi';
import { FloorPlanGrid } from '../../components/floor-plan/FloorPlanGrid';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { styles } from './AdminCreateReservationScreen.styles';
import { Colors } from '../../styles/colors';

const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const TIME_OPTIONS = Array.from({ length: 21 }, (_, i) => {
  const totalMinutes = 10 * 60 + i * 30;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
});

export const AdminCreateReservationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { data: restData } = useGetAdminRestaurantQuery();
  const restaurant = restData?.data;

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState('19:00');
  const [guestCount, setGuestCount] = useState(2);
  const [customerId, setCustomerId] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);

  const dateStr = formatDate(date);
  const { data: floorData, isFetching: floorLoading } = useGetFloorPlanQuery(dateStr);
  const grid = floorData?.data?.grid ?? [];

  const [adminCreate, { isLoading }] = useAdminCreateReservationMutation();

  const handleTablePress = (table: FloorPlanTable) => {
    if (!table.is_active) return;
    setSelectedTableIds((prev) =>
      prev.includes(table.id)
        ? prev.filter((id) => id !== table.id)
        : prev.length < 2
          ? [...prev, table.id]
          : [prev[1], table.id] // max 2, shift
    );
  };

  const handleCreate = async () => {
    if (!customerId.trim()) { Alert.alert('Error', 'Customer ID is required.'); return; }
    if (selectedTableIds.length === 0) { Alert.alert('Error', 'Select at least 1 table.'); return; }
    try {
      const result = await adminCreate({
        customerId,
        restaurantId: restaurant!.id,
        tableIds: selectedTableIds,
        reservationDate: dateStr,
        startTime,
        guestCount,
        specialRequests: specialRequests || undefined,
      }).unwrap();
      const bumped = (result as any).bumped;
      const msg = bumped ? `Reservation created. ${bumped} reservation(s) bumped.` : 'Reservation created.';
      Alert.alert('Success', msg, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      Alert.alert('Error', err?.data?.error?.message ?? 'Failed to create.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Customer ID */}
        <Input
          label="Customer ID"
          value={customerId}
          onChangeText={setCustomerId}
          keyboardType="numeric"
          isDark
          hint="Enter the customer's numeric ID"
        />

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATE</Text>
          <TouchableOpacity style={styles.dateRow} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              minimumDate={new Date()}
              onChange={(_, d) => { setShowDatePicker(false); if (d) setDate(d); }}
            />
          )}
        </View>

        {/* Time */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>START TIME</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeRow}>
              {TIME_OPTIONS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeChip, startTime === t && styles.timeChipActive]}
                  onPress={() => setStartTime(t)}
                >
                  <Text style={[styles.timeChipText, startTime === t && styles.timeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Guests */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>GUESTS ({guestCount})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeRow}>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.timeChip, guestCount === n && styles.timeChipActive]}
                  onPress={() => setGuestCount(n)}
                >
                  <Text style={[styles.timeChipText, guestCount === n && styles.timeChipTextActive]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Floor plan */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SELECT TABLES ({selectedTableIds.length}/2)</Text>
          {floorLoading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <FloorPlanGrid
              grid={grid}
              gridRows={restaurant?.grid_rows ?? 4}
              gridCols={restaurant?.grid_cols ?? 5}
              selectedTableIds={selectedTableIds}
              onTablePress={handleTablePress}
              isSelectable
            />
          )}
        </View>

        {/* Special requests */}
        <Input
          label="Special Requests"
          value={specialRequests}
          onChangeText={setSpecialRequests}
          isDark
          placeholder="Optional notes..."
          multiline
          numberOfLines={3}
        />

        <Button label="Create Reservation" onPress={handleCreate} loading={isLoading} fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
};