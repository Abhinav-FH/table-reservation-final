import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AdminStackParamList, TimeSlot } from '../../types';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { DatePicker } from '../../components/common/DatePicker';
import { GuestPicker } from '../../components/common/GuestPicker';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  fetchAdminReservationByIdRequest, adminUpdateReservationRequest, fetchAvailabilityRequest, clearTimeSlots,
} from '../../store/slices/reservationSlice';
import { useTheme } from '../../hooks/useTheme';
import { createFormStyles } from '../customer/NewReservationScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { dateUtils } from '../../utils/dateUtils';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import Toast from 'react-native-toast-message';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminEditReservation'>;
  route: RouteProp<AdminStackParamList, 'AdminEditReservation'>;
};

export const AdminEditReservationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { reservationId } = route.params;
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { selected, timeSlots, isSlotLoading, isLoading } = useAppSelector((s) => s.reservation);
  const styles = createFormStyles(colors);

  const [date, setDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [slotsChecked, setSlotsChecked] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminReservationByIdRequest(reservationId));
    return () => { dispatch(clearTimeSlots()); };
  }, []);

  useEffect(() => {
    if (selected && selected.id === reservationId) {
      const res = selected as any;
      const resDate = res.reservationDate ?? res.reservation_date ?? '';
      const resGuests = res.guestCount ?? res.guest_count ?? 2;
      const resStart = res.startTime ?? res.start_time ?? '';
      const resEnd = res.endTime ?? res.end_time ?? '';
      const resRequests = res.specialRequests ?? res.special_requests ?? '';
      
      setDate(resDate);
      setGuestCount(resGuests);
      setSpecialRequests(resRequests);
      setSelectedSlot({
        start_time: resStart,
        end_time: resEnd,
        available: true,
        available_tables: selected.tables?.length ?? 1,
      });
      setSlotsChecked(true);
    }
  }, [selected]);

  useEffect(() => {
    setSelectedSlot(null);
    setSlotsChecked(false);
  }, [date, guestCount]);

  if (!selected) return <LoadingOverlay fullScreen />;

  const checkAvailability = () => {
    if (!date) { Toast.show({ type: 'error', text1: 'Select a date first' }); return; }
    setSlotsChecked(true);
    setSelectedSlot(null);
    const res = selected as any;
    const restId = res.restaurantId ?? res.restaurant_id;
    dispatch(fetchAvailabilityRequest({ restaurantId: restId, date, guestCount }));
  };

  const handleSubmit = () => {
    if (!selectedSlot) { Toast.show({ type: 'error', text1: 'Select a time slot' }); return; }
    dispatch(adminUpdateReservationRequest({
      id: reservationId,
      reservationDate: date,
      startTime: selectedSlot.start_time,
      guestCount,
      specialRequests: specialRequests || undefined,
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
          <Text style={styles.title}>Edit Reservation #{reservationId}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <DatePicker label="Date" value={date} onChange={setDate} />
          <GuestPicker label="Guests" value={guestCount} onChange={setGuestCount} min={1} max={12} />

          <AppButton label={slotsChecked ? 'Refresh Times' : 'Check Availability'} variant="outline" fullWidth onPress={checkAvailability} isLoading={isSlotLoading} />

          {slotsChecked && !isSlotLoading && (
            <View style={styles.slotsSection}>
              <Text style={styles.sectionTitle}>{timeSlots.length > 0 ? 'Pick a New Time' : 'No Slots Available'}</Text>
              {timeSlots.length > 0 && (
                <View style={styles.slotsGrid}>
                  {timeSlots.map((slot, i) => {
                    const active = selectedSlot?.start_time === slot.start_time;
                    const isPast = dateUtils.isPastTimeSlot(date, slot.start_time);
                    const unavailable = !slot.available || isPast;
                    return (
                      <TouchableOpacity key={i}
                        style={[styles.slotChip, active && styles.slotChipActive, unavailable && styles.slotChipDisabled]}
                        onPress={() => !unavailable && setSelectedSlot(slot)} disabled={unavailable}>
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

          <AppInput label="Special Requests (Optional)" value={specialRequests} onChangeText={setSpecialRequests} multiline numberOfLines={3} style={styles.textarea} />

          <AppButton label="Save Changes" fullWidth onPress={handleSubmit} isLoading={isLoading} style={styles.submitBtn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};