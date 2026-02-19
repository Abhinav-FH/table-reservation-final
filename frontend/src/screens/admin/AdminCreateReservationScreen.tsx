import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import {
  useGetFloorPlanQuery,
  useAdminCreateReservationMutation,
  useLazyLookupCustomerByPhoneQuery,
  useGetAdminRestaurantQuery,
  FloorPlanTable,
} from '../../store/api/adminApi';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { styles, SLOT_HEIGHT } from './AdminCreateReservationScreen.styles';
import { Colors } from '../../styles/colors';
import { Spacing } from '../../styles/spacing';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const getMaxDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d;
};

const TIME_SLOTS: string[] = [];
for (let h = 10; h <= 20; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 20) TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
}

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// ── Mini table cell for floor plan ───────────────────────────────────────────
const getTableColor = (table: FloorPlanTable, isSelected: boolean) => {
  if (isSelected) return Colors.primary;
  if (!table.isActive) return Colors.tableDisabled;
  if (table.status === 'booked') return Colors.tableBooked;
  return Colors.tableAvailable;
};

const MiniTable: React.FC<{
  table: FloorPlanTable;
  cellSize: number;
  isSelected: boolean;
  onPress: () => void;
  disabled: boolean;
}> = ({ table, cellSize, isSelected, onPress, disabled }) => {
  const color = getTableColor(table, isSelected);
  return (
    <TouchableOpacity
      style={[
        styles.miniTable,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: color + '22',
          borderColor: color,
          borderWidth: isSelected ? 2.5 : 1.5,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Text style={[styles.miniTableLabel, { color }]} numberOfLines={1}>
        {table.label}
      </Text>
      <Text style={[styles.miniTableCap, { color }]}>{table.capacity}p</Text>
    </TouchableOpacity>
  );
};

const MiniEmptyCell: React.FC<{ size: number }> = ({ size }) => (
  <View style={[styles.miniEmpty, { width: size, height: size }]} />
);

// ── Main screen ───────────────────────────────────────────────────────────────
export const AdminCreateReservationScreen: React.FC = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  // ── Restaurant ──────────────────────────────────────────────────────────────
  const { data: restaurantData } = useGetAdminRestaurantQuery();
  const restaurant = restaurantData?.data;

  // ── Customer lookup by phone ────────────────────────────────────────────────
  const [phone, setPhone] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [lookupCustomer, { isFetching: isLooking }] =
    useLazyLookupCustomerByPhoneQuery();

  const handlePhoneLookup = async () => {
    if (!phone.trim()) {
      Alert.alert('Required', 'Enter a phone number to search.');
      return;
    }
    try {
      const result = await lookupCustomer(phone.trim()).unwrap();
      setFoundCustomer(result.data);
    } catch (err: any) {
      const msg = err?.data?.error?.message ?? 'No customer found with that phone number.';
      Alert.alert('Not Found', msg);
      setFoundCustomer(null);
    }
  };

  // ── Date ────────────────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateStr = formatDate(selectedDate);

  // ── Time ────────────────────────────────────────────────────────────────────
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // ── Guests ──────────────────────────────────────────────────────────────────
  const [guestCount, setGuestCount] = useState(2);

  // ── Floor plan + table selection ────────────────────────────────────────────
  const { data: floorData, isLoading: floorLoading } = useGetFloorPlanQuery(dateStr);
  const grid: (FloorPlanTable | null)[][] = floorData?.data?.grid ?? [];
  const gridCols = restaurant?.gridCols ?? 5;
  const gridRows = restaurant?.gridRows ?? 4;
  const cellSize = Math.floor((width - Spacing.xxl * 2 - 40) / gridCols);

  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);

  const handleTablePress = (table: FloorPlanTable) => {
    if (!table.isActive) {
      Alert.alert('Table Inactive', 'This table is deactivated. Activate it on the Floor Plan screen first.');
      return;
    }
    if (table.status === 'booked') {
      Alert.alert(
        'Table Booked',
        'This table is already booked at the selected time. Selecting it will bump the existing reservation to PENDING.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Select Anyway',
            onPress: () => toggleTable(table.id),
          },
        ],
      );
      return;
    }
    toggleTable(table.id);
  };

  const toggleTable = (id: string) => {
    setSelectedTableIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) {
        Alert.alert('Max 2 Tables', 'You can select up to 2 tables per reservation.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // ── Special requests ────────────────────────────────────────────────────────
  const [specialRequests, setSpecialRequests] = useState('');

  // ── Submit ──────────────────────────────────────────────────────────────────
  const [createReservation, { isLoading: isCreating }] = useAdminCreateReservationMutation();

  const handleCreate = async () => {
    if (!foundCustomer) {
      Alert.alert('No Customer', 'Search for a customer by phone number first.');
      return;
    }
    if (!selectedTime) {
      Alert.alert('No Time', 'Please select a time slot.');
      return;
    }
    if (selectedTableIds.length === 0) {
      Alert.alert('No Tables', 'Please select at least one table from the floor plan.');
      return;
    }
    if (!restaurant) return;

    try {
      const result = await createReservation({
        customerId: foundCustomer.id,
        restaurantId: restaurant.id,
        tableIds: selectedTableIds,
        reservationDate: dateStr,
        startTime: selectedTime,
        guestCount,
        specialRequests: specialRequests.trim() || undefined,
      }).unwrap();

      const bumped = (result as any).bumped ?? 0;
      Alert.alert(
        'Reservation Created ✓',
        bumped > 0
          ? `Reservation created. ${bumped} conflicting reservation${bumped > 1 ? 's were' : ' was'} moved to PENDING.`
          : 'Reservation created successfully.',
        [{ text: 'Done', onPress: () => navigation.goBack() }],
      );
    } catch (err: any) {
      Alert.alert('Error', err?.data?.error?.message ?? 'Could not create reservation.');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Customer by phone ─────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CUSTOMER</Text>
          <Text style={styles.sectionHint}>Search by phone number</Text>

          <View style={styles.phoneRow}>
            <View style={{ flex: 1 }}>
              <Input
                label="Phone Number"
                value={phone}
                onChangeText={(t) => {
                  setPhone(t);
                  setFoundCustomer(null);
                }}
                keyboardType="phone-pad"
                placeholder="+91 98765 43210"
                isDark
              />
            </View>
            <TouchableOpacity
              style={styles.lookupBtn}
              onPress={handlePhoneLookup}
              disabled={isLooking}
            >
              {isLooking ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Ionicons name="search" size={18} color={Colors.primary} />
              )}
            </TouchableOpacity>
          </View>

          {foundCustomer && (
            <View style={styles.customerCard}>
              <View style={styles.customerAvatar}>
                <Text style={styles.customerAvatarText}>
                  {foundCustomer.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.customerName}>{foundCustomer.name}</Text>
                <Text style={styles.customerEmail}>{foundCustomer.email}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color={Colors.tableAvailable} />
            </View>
          )}
        </View>

        {/* ── 2. Date ──────────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATE</Text>
          <Text style={styles.sectionHint}>Up to 30 days ahead</Text>
          <TouchableOpacity style={styles.dateRow} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
            <Text style={styles.dateChange}>Change</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              minimumDate={new Date()}
              maximumDate={getMaxDate()}
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                  setSelectedTime(null);
                  setSelectedTableIds([]);
                }
              }}
            />
          )}
        </View>

        {/* ── 3. Guest count ───────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            GUESTS — <Text style={styles.sectionAccent}>{guestCount} selected</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.guestRow}>
              {GUEST_OPTIONS.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.guestChip, guestCount === n && styles.guestChipActive]}
                  onPress={() => {
                    setGuestCount(n);
                    setSelectedTableIds([]);
                  }}
                >
                  <Text style={[styles.guestText, guestCount === n && styles.guestTextActive]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* ── 4. Time — scrollable drum ────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            TIME
            {selectedTime
              ? <Text style={styles.sectionAccent}> — {selectedTime}</Text>
              : <Text style={styles.sectionHintInline}> — scroll to pick</Text>
            }
          </Text>
          <View style={styles.drumWrapper}>
            <View style={styles.drumHighlight} pointerEvents="none" />
            <FlatList
              ref={flatListRef}
              data={TIME_SLOTS}
              keyExtractor={(s) => s}
              showsVerticalScrollIndicator={false}
              snapToInterval={SLOT_HEIGHT}
              decelerationRate="fast"
              style={styles.drum}
              contentContainerStyle={styles.drumContent}
              getItemLayout={(_, index) => ({
                length: SLOT_HEIGHT,
                offset: SLOT_HEIGHT * index,
                index,
              })}
              renderItem={({ item }) => {
                const isSelected = selectedTime === item;
                return (
                  <TouchableOpacity
                    style={[styles.slotItem, isSelected && styles.slotItemSelected]}
                    onPress={() => {
                      setSelectedTime(item);
                      setSelectedTableIds([]);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                      {item}
                    </Text>
                    {isSelected && <View style={styles.slotDot} />}
                  </TouchableOpacity>
                );
              }}
            />
            <View style={styles.drumFadeTop} pointerEvents="none" />
            <View style={styles.drumFadeBottom} pointerEvents="none" />
          </View>
        </View>

        {/* ── 5. Floor plan table selection ───────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            SELECT TABLES
            {selectedTableIds.length > 0
              ? <Text style={styles.sectionAccent}> — {selectedTableIds.length} selected (max 2)</Text>
              : <Text style={styles.sectionHintInline}> — tap to select</Text>
            }
          </Text>

          {/* Legend */}
          <View style={styles.floorLegend}>
            {[
              { color: Colors.tableAvailable, label: 'Available' },
              { color: Colors.tableBooked, label: 'Booked' },
              { color: Colors.tableDisabled, label: 'Inactive' },
              { color: Colors.primary, label: 'Selected' },
            ].map(({ color, label }) => (
              <View key={label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {floorLoading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.miniGrid}>
                {Array.from({ length: gridRows }, (_, row) => (
                  <View key={row} style={styles.miniGridRow}>
                    {Array.from({ length: gridCols }, (_, col) => {
                      const cell = grid[row]?.[col] ?? null;
                      if (!cell) return <MiniEmptyCell key={col} size={cellSize} />;
                      return (
                        <MiniTable
                          key={col}
                          table={cell}
                          cellSize={cellSize}
                          isSelected={selectedTableIds.includes(cell.id)}
                          onPress={() => handleTablePress(cell)}
                          disabled={false}
                        />
                      );
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        {/* ── 6. Special requests ──────────────────────────────────────────── */}
        <View style={styles.section}>
          <Input
            label="Special Requests (optional)"
            value={specialRequests}
            onChangeText={setSpecialRequests}
            placeholder="Dietary needs, seating preferences..."
            isDark
          />
        </View>

        {/* ── Summary + submit ─────────────────────────────────────────────── */}
        {foundCustomer && selectedTime && selectedTableIds.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Reservation Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Customer</Text>
              <Text style={styles.summaryValue}>{foundCustomer.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>
                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Guests</Text>
              <Text style={styles.summaryValue}>{guestCount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tables</Text>
              <Text style={styles.summaryValue}>{selectedTableIds.length} selected</Text>
            </View>
          </View>
        )}

        <Button
          label="Create Reservation"
          onPress={handleCreate}
          loading={isCreating}
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
};