import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CustomerStackParamList, TimeSlot } from '../../types';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { DatePicker } from '../../components/common/DatePicker';
import { GuestPicker } from '../../components/common/GuestPicker';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  fetchAvailabilityRequest, createReservationRequest, clearTimeSlots,
} from '../../store/slices/reservationSlice';
import { useTheme } from '../../hooks/useTheme';
import { createFormStyles } from './NewReservationScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { dateUtils } from '../../utils/dateUtils';
import Toast from 'react-native-toast-message';
import { Spacing } from '../../constants/layout';

type Props = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'NewReservation'>;
  route: RouteProp<CustomerStackParamList, 'NewReservation'>;
};

export const NewReservationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { restaurantId } = route.params;
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { timeSlots, isSlotLoading, isLoading } = useAppSelector((s) => s.reservation);
  const styles = createFormStyles(colors);

  const [date, setDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [dateError, setDateError] = useState('');
  const [slotsChecked, setSlotsChecked] = useState(false);

  useEffect(() => () => { dispatch(clearTimeSlots()); }, []);
  useEffect(() => { setSelectedSlot(null); setSlotsChecked(false); }, [date, guestCount]);

  const checkAvailability = () => {
    if (!date) { setDateError('Please select a date first'); return; }
    setDateError('');
    setSelectedSlot(null);
    setSlotsChecked(true);
    dispatch(fetchAvailabilityRequest({ restaurantId, date, guestCount }));
  };

  const handleSubmit = () => {
    if (!selectedSlot) {
      Toast.show({ type: 'error', text1: 'Select a time slot first' });
      return;
    }
    dispatch(createReservationRequest({
      restaurantId: Number(restaurantId),
      reservationDate: date,
      startTime: selectedSlot.start_time.slice(0, 5),
      guestCount,
      specialRequests: specialRequests.trim() || undefined,
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
          <DatePicker
            label="1. Select Date"
            value={date}
            onChange={(d) => { setDate(d); setDateError(''); }}
            error={dateError}
          />

          <GuestPicker label="2. Number of Guests" value={guestCount} onChange={setGuestCount} min={1} max={12} />

          <AppButton
            label={slotsChecked ? 'Refresh Availability' : '3. Check Available Times'}
            variant="outline"
            fullWidth
            onPress={checkAvailability}
            isLoading={isSlotLoading}
            style={{ marginBottom: Spacing.md }}
          />

          {slotsChecked && !isSlotLoading && (
            <View style={styles.slotsSection}>
              <Text style={styles.sectionTitle}>
                {timeSlots.length > 0 ? '4. Pick a Time' : 'No Times Available'}
              </Text>

              {timeSlots.length === 0 ? (
                <View style={styles.noSlotsBox}>
                  <Ionicons name="calendar-clear-outline" size={32} color={colors.textMuted} />
                  <Text style={styles.noSlots}>No availability for {guestCount} guests on this date.</Text>
                  <Text style={styles.noSlotsHint}>Try another date or fewer guests.</Text>
                </View>
              ) : (
                <View style={styles.slotsGrid}>
                  {timeSlots.map((slot, i) => {
                    const isSelected = selectedSlot?.start_time === slot.start_time;
                    const isPast = dateUtils.isPastTimeSlot(date, slot.start_time);
                    const isUnavailable = !slot.available || isPast;
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.slotChip,
                          isSelected && styles.slotChipActive,
                          isUnavailable && styles.slotChipDisabled,
                        ]}
                        onPress={() => { if (!isUnavailable) setSelectedSlot(slot); }}
                        disabled={isUnavailable}
                        activeOpacity={0.75}
                      >
                        <Text style={[
                          styles.slotText,
                          isSelected && styles.slotTextActive,
                          isUnavailable && styles.slotTextDisabled,
                        ]}>
                          {dateUtils.formatTime(slot.start_time)}
                        </Text>
                        {isUnavailable && <Text style={styles.slotFullLabel}>{isPast ? 'Past' : 'Full'}</Text>}
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
                {selectedSlot.end_time ? ` – ${dateUtils.formatTime(selectedSlot.end_time)}` : ''}
              </Text>
            </View>
          )}

          <AppInput
            label="Special Requests (Optional)"
            placeholder="Dietary requirements, occasion, seating preference..."
            value={specialRequests}
            onChangeText={setSpecialRequests}
            multiline
            numberOfLines={3}
            style={styles.textarea}
          />

          <AppButton
            label="Confirm Reservation"
            fullWidth
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitBtn}
            disabled={!selectedSlot}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};