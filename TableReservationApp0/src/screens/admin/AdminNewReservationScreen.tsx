import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList, Table, TimeSlot } from '../../types';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { DatePicker } from '../../components/common/DatePicker';
import { GuestPicker } from '../../components/common/GuestPicker';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { adminCreateReservationRequest, fetchAvailabilityRequest, clearTimeSlots } from '../../store/slices/reservationSlice';
import { fetchTablesRequest } from '../../store/slices/tableSlice';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { createFormStyles } from '../customer/NewReservationScreen.styles';
import { dateUtils } from '../../utils/dateUtils';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminNewReservation'>;
};

function isValidTime(t: string): boolean {
  return /^\d{2}:\d{2}$/.test(t.trim());
}
export const AdminNewReservationScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading, timeSlots, isSlotLoading } = useAppSelector((s) => s.reservation);
  const { adminRestaurant } = useAppSelector((s) => s.restaurant);
  const { list: tables, isLoading: isLoadingTables } = useAppSelector((s) => s.table);
  const styles = createFormStyles(colors);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [guestCount, setGuestCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);
  const [slotsChecked, setSlotsChecked] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchTablesRequest());
    return () => { dispatch(clearTimeSlots()); };
  }, [dispatch]);

  useEffect(() => {
    setSelectedSlot(null);
    setSlotsChecked(false);
  }, [date, guestCount]);

  const handleSelectTable = (id: number) => {
    setSelectedTableIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
    setErrors((e) => ({ ...e, tables: '' }));
  };

  const checkAvailability = () => {
    if (!date) { Toast.show({ type: 'error', text1: 'Select a date first' }); return; }
    if (!adminRestaurant) { Toast.show({ type: 'error', text1: 'No restaurant found' }); return; }
    setSlotsChecked(true);
    setSelectedSlot(null);
    dispatch(fetchAvailabilityRequest({ restaurantId: adminRestaurant.id, date, guestCount }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customerName.trim()) e.name = 'Customer name is required';
    if (!customerEmail.trim()) e.email = 'Email is required';
    if (!customerPhone.trim()) e.phone = 'Phone number is required';
    if (!date) e.date = 'Select a date';
    if (!selectedSlot) e.time = 'Select a time slot';
    if (selectedTableIds.length === 0) e.tables = 'Select at least one table';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (!adminRestaurant) {
      Toast.show({ type: 'error', text1: 'No restaurant found' });
      return;
    }

    dispatch(adminCreateReservationRequest({
      walkIn: {
        name: customerName.trim(),
        email: customerEmail.trim().toLowerCase(),
        phone: customerPhone.trim(),
      },
      restaurantId: adminRestaurant.id,
      reservationDate: date,
      startTime: selectedSlot!.start_time,
      guestCount,
      tableIds: selectedTableIds,
      specialRequests: specialRequests.trim() || undefined,
    } as any));
    navigation.goBack();
  };

  const s = {
    sectionHeader: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold as any, color: colors.textMuted, letterSpacing: 0.8, marginBottom: Spacing.sm, marginTop: Spacing.md },
    infoBox: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: 8, backgroundColor: colors.surfaceSecondary, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md },
    infoText: { fontSize: FontSize.xs, color: colors.textSecondary, flex: 1, lineHeight: 18 },
    errorText: { fontSize: FontSize.xs, color: Colors.error, marginTop: 4, marginBottom: 4 },
    tableGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 10 },
    tableChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.inputBackground },
    tableChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    tableText: { color: colors.text, fontSize: FontSize.sm },
    tableTextSelected: { color: Colors.white, fontWeight: FontWeight.semibold },
  };

  const TablePicker = () => {
    // Check which tables are booked for the selected slot
    const getBookedTables = (): Set<number> => {
      if (!selectedSlot || !date) return new Set();
      
      // Backend returns availability per slot, but doesn't tell us which specific tables are booked
      // For now, if slot is unavailable, we can't determine specific tables
      // Backend will validate on submission
      return new Set();
    };

    const bookedTableIds = getBookedTables();

    return (
      <View>
        <Text style={s.sectionHeader}>ASSIGN TABLES</Text>
        {!selectedSlot && <Text style={[s.infoText, { marginBottom: Spacing.sm }]}>Select a time slot first to check table availability</Text>}
        {errors.tables && <Text style={s.errorText}>{errors.tables}</Text>}
        <View style={s.tableGrid}>
          {tables.map((table: Table) => {
            const isBooked = bookedTableIds.has(table.id);
            const isDisabled = !selectedSlot || isBooked;
            return (
              <TouchableOpacity
                key={table.id}
                style={[s.tableChip, selectedTableIds.includes(table.id) && s.tableChipSelected, isDisabled && { opacity: 0.5 }]}
                onPress={() => !isDisabled && handleSelectTable(table.id)}
                disabled={isDisabled}
              >
                <Text style={[s.tableText, selectedTableIds.includes(table.id) && s.tableTextSelected]}>
                  {table.label} ({table.capacity}){isBooked ? ' 🔒' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>New Reservation</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {adminRestaurant && (
            <View style={{ backgroundColor: colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="storefront-outline" size={18} color={colors.textSecondary} />
              <Text style={{ fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: colors.text }}>{adminRestaurant.name}</Text>
            </View>
          )}

          <Text style={s.sectionHeader}>CUSTOMER DETAILS</Text>
          <View style={s.infoBox}><Ionicons name="information-circle-outline" size={16} color={colors.textMuted} /><Text style={s.infoText}>Enter customer's details. New customers are registered automatically.</Text></View>
          <AppInput label="Full Name" placeholder="e.g. John Smith" value={customerName} onChangeText={t => { setCustomerName(t); setErrors(e => ({ ...e, name: '' })); }} leftIcon="person-outline" error={errors.name} />
          <AppInput label="Email" placeholder="e.g. john@email.com" value={customerEmail} onChangeText={t => { setCustomerEmail(t); setErrors(e => ({ ...e, email: '' })); }} leftIcon="mail-outline" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
          <AppInput label="Phone Number" placeholder="e.g. +91 9876543210" value={customerPhone} onChangeText={t => { setCustomerPhone(t); setErrors(e => ({ ...e, phone: '' })); }} leftIcon="call-outline" keyboardType="phone-pad" error={errors.phone} />

          <Text style={s.sectionHeader}>RESERVATION DETAILS</Text>
          <DatePicker label="Date" value={date} onChange={d => { setDate(d); setErrors(e => ({ ...e, date: '' })); }} error={errors.date} />
          <GuestPicker label="Number of Guests" value={guestCount} onChange={setGuestCount} min={1} max={12} />

          <AppButton label={slotsChecked ? 'Refresh Times' : 'Check Availability'} variant="outline" fullWidth onPress={checkAvailability} isLoading={isSlotLoading} />

          {slotsChecked && !isSlotLoading && (
            <View style={styles.slotsSection}>
              <Text style={styles.sectionTitle}>{timeSlots.length > 0 ? 'Select Time' : 'No Slots Available'}</Text>
              {timeSlots.length > 0 && (
                <View style={styles.slotsGrid}>
                  {timeSlots.map((slot, i) => {
                    const active = selectedSlot?.start_time === slot.start_time;
                    const isPast = dateUtils.isPastTimeSlot(date, slot.start_time);
                    const unavailable = !slot.available || isPast;
                    return (
                      <TouchableOpacity key={i}
                        style={[styles.slotChip, active && styles.slotChipActive, unavailable && styles.slotChipDisabled]}
                        onPress={() => { if (slot.available && !isPast) { setSelectedSlot(slot); setErrors(e => ({ ...e, time: '' })); } }}
                        disabled={unavailable}>
                        <Text style={[styles.slotText, active && styles.slotTextActive, unavailable && styles.slotTextDisabled]}>
                          {dateUtils.formatTime(slot.start_time)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {selectedSlot && (
            <View style={styles.selectedBanner}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.selectedBannerText}>
                {dateUtils.formatDate(date)} · {dateUtils.formatTime(selectedSlot.start_time)}
              </Text>
            </View>
          )}
          {errors.time && <Text style={s.errorText}>{errors.time}</Text>}

          <TablePicker />

          <AppInput label="Special Requests (Optional)" placeholder="Dietary requirements, occasion..." value={specialRequests} onChangeText={setSpecialRequests} multiline numberOfLines={3} style={styles.textarea} />

          <AppButton label={isLoading ? 'Creating...' : 'Create Reservation'} fullWidth onPress={handleSubmit} isLoading={isLoading} style={styles.submitBtn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};