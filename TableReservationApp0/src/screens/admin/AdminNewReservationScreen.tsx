import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList, TimeSlot } from '../../types';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  fetchAvailabilityRequest,
  adminCreateReservationRequest,
  clearTimeSlots,
} from '../../store/slices/reservationSlice';
import { fetchRestaurantsRequest } from '../../store/slices/restaurantSlice';
import { useTheme } from '../../hooks/useTheme';
import { createFormStyles } from '../customer/NewReservationScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import { dateUtils } from '../../utils/dateUtils';
import Toast from 'react-native-toast-message';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminNewReservation'>;
};

export const AdminNewReservationScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { timeSlots, isSlotLoading, isLoading } = useAppSelector((s) => s.reservation);
  const { adminRestaurant } = useAppSelector((s) => s.restaurant);
  const styles = createFormStyles(colors);

  const [date, setDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [slotsChecked, setSlotsChecked] = useState(false);

  useEffect(() => {
    return () => { dispatch(clearTimeSlots()); };
  }, []);

  const checkAvailability = () => {
    if (!adminRestaurant || !date || !guestCount) {
      Toast.show({ type: 'error', text1: 'Fill date and guest count' });
      return;
    }
    setSlotsChecked(true);
    setSelectedSlot(null);
    dispatch(fetchAvailabilityRequest({
      restaurantId: adminRestaurant.id,
      date,
      guestCount: Number(guestCount),
    }));
  };

  const handleSubmit = () => {
    if (!selectedSlot || !adminRestaurant) {
      Toast.show({ type: 'error', text1: 'Select a time slot' });
      return;
    }
    dispatch(adminCreateReservationRequest({
      restaurant_id: adminRestaurant.id,
      reservation_date: date,
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
      guest_count: Number(guestCount),
      special_requests: specialRequests || undefined,
    }));
    navigation.goBack();
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
            <View style={{ marginBottom: 16, padding: 12, backgroundColor: colors.surface, borderRadius: 10 }}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>{adminRestaurant.name}</Text>
            </View>
          )}

          <AppInput label="Date (YYYY-MM-DD)" placeholder="e.g. 2026-03-15" value={date} onChangeText={setDate} leftIcon="calendar-outline" />
          <AppInput label="Number of Guests" placeholder="e.g. 4" value={guestCount} onChangeText={setGuestCount} keyboardType="numeric" leftIcon="people-outline" />
          <AppInput label="Special Requests (Optional)" placeholder="Any requirements?" value={specialRequests} onChangeText={setSpecialRequests} multiline style={styles.textarea} />

          <AppButton label="Check Availability" variant="outline" fullWidth onPress={checkAvailability} isLoading={isSlotLoading} />

          {slotsChecked && !isSlotLoading && (
            <View style={styles.slotsSection}>
              <Text style={styles.sectionTitle}>Available Time Slots</Text>
              {timeSlots.length === 0 ? (
                <Text style={styles.noSlots}>No slots available.</Text>
              ) : (
                <View style={styles.slotsGrid}>
                  {timeSlots.map((slot, i) => {
                    const active = selectedSlot?.start_time === slot.start_time;
                    return (
                      <TouchableOpacity key={i} style={[styles.slotChip, active && styles.slotChipActive, !slot.available && styles.slotChipDisabled]} onPress={() => slot.available && setSelectedSlot(slot)} disabled={!slot.available}>
                        <Text style={[styles.slotText, active && styles.slotTextActive]}>{dateUtils.formatTime(slot.start_time)}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          <AppButton label="Create Reservation" fullWidth onPress={handleSubmit} isLoading={isLoading} style={styles.submitBtn} disabled={!selectedSlot} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
