import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList, Table } from '../../types';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { DatePicker } from '../../components/common/DatePicker';
import { GuestPicker } from '../../components/common/GuestPicker';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { adminCreateReservationRequest } from '../../store/slices/reservationSlice';
import { fetchTablesRequest } from '../../store/slices/tableSlice';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';
import { Colors } from '../../constants/colors';
import { createFormStyles } from '../customer/NewReservationScreen.styles';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminNewReservation'>;
};

function isValidTime(t: string): boolean {
  return /^\d{2}:\d{2}$/.test(t.trim());
}

export const AdminNewReservationScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((s) => s.reservation);
  const { adminRestaurant } = useAppSelector((s) => s.restaurant);
  const { list: tables, isLoading: isLoadingTables } = useAppSelector((s) => s.table);
  const styles = createFormStyles(colors);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchTablesRequest());
  }, [dispatch]);

  const handleSelectTable = (id: number) => {
    setSelectedTableIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
    setErrors((e) => ({ ...e, tables: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customerName.trim()) e.name = 'Customer name is required';
    if (!customerEmail.trim()) e.email = 'Email is required';
    if (!customerPhone.trim()) e.phone = 'Phone number is required';
    if (!date) e.date = 'Select a date';
    if (!startTime.trim()) {
      e.time = 'Enter start time';
    } else if (!isValidTime(startTime)) {
      e.time = 'Format must be HH:MM (e.g. 19:30)';
    }
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
      startTime: startTime.trim(),
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
    tableChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
    tableChipSelected: { backgroundColor: colors.background, borderColor: colors.border },
    tableText: { color: colors.text },
    tableTextSelected: { color: Colors.white },
  };

  const TablePicker = () => (
    <View>
      <Text style={s.sectionHeader}>ASSIGN TABLES</Text>
      {errors.tables && <Text style={s.errorText}>{errors.tables}</Text>}
      <View style={s.tableGrid}>
        {tables.map((table: Table) => (
          <TouchableOpacity
            key={table.id}
            style={[s.tableChip, selectedTableIds.includes(table.id) && s.tableChipSelected]}
            onPress={() => handleSelectTable(table.id)}
          >
            <Text style={[s.tableText, selectedTableIds.includes(table.id) && s.tableTextSelected]}>
              {table.label} ({table.capacity})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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
          <AppInput label="Start Time" placeholder="HH:MM  (e.g. 19:30)" value={startTime} onChangeText={t => { setStartTime(t); setErrors(e => ({ ...e, time: '' })); }} leftIcon="time-outline" keyboardType="numeric" maxLength={5} error={errors.time} />
          {!errors.time && <Text style={[s.infoText, { marginTop: -Spacing.sm, marginBottom: Spacing.md }]}>Use 24-hour format.</Text>}

          <TablePicker />

          <AppInput label="Special Requests (Optional)" placeholder="Dietary requirements, occasion..." value={specialRequests} onChangeText={setSpecialRequests} multiline numberOfLines={3} style={styles.textarea} />

          <AppButton label={isLoading ? 'Creating...' : 'Create Reservation'} fullWidth onPress={handleSubmit} isLoading={isLoading} style={styles.submitBtn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};