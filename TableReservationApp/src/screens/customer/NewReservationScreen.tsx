import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CustomerStackParamList } from '../../types';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  fetchAvailabilityRequest,
  createReservationRequest,
  clearTimeSlots,
} from '../../store/slices/reservationSlice';
import { useTheme } from '../../hooks/useTheme';
import { createFormStyles } from './NewReservationScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { dateUtils } from '../../utils/dateUtils';
import { TimeSlot } from '../../types';
import Toast from 'react-native-toast-message';

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
  const [guestCount, setGuestCount] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slotsChecked, setSlotsChecked] = useState(false);

  useEffect(() => {
    return () => { dispatch(clearTimeSlots()); };
  }, []);

  const validateDateGuests = () => {
    const e: Record<string, string> = {};
    if (!date) e.date = 'Please enter a date (YYYY-MM-DD)';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) e.date = 'Use format YYYY-MM-DD';
    if (!guestCount || isNaN(Number(guestCount)) || Number(guestCount) < 1)
      e.guestCount = 'Enter valid guest count';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const checkAvailability = () => {
    if (!validateDateGuests()) return;
    setSelectedSlot(null);
    setSlotsChecked(true);
    dispatch(fetchAvailabilityRequest({
      restaurantId,
      date,
      guestCount: Number(guestCount),
    }));
  };

  const handleSubmit = () => {
    if (!selectedSlot) {
      Toast.show({ type: 'error', text1: 'Select a time slot', text2: 'Please pick an available slot first.' });
      return;
    }
    dispatch(createReservationRequest({
      restaurant_id: restaurantId,
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
          <Text style={styles.sectionTitle}>Reservation Details</Text>

          <AppInput
            label="Date (YYYY-MM-DD)"
            placeholder="e.g. 2026-03-15"
            value={date}
            onChangeText={setDate}
            leftIcon="calendar-outline"
            error={errors.date}
          />
          <AppInput
            label="Number of Guests"
            placeholder="e.g. 4"
            value={guestCount}
            onChangeText={setGuestCount}
            keyboardType="numeric"
            leftIcon="people-outline"
            error={errors.guestCount}
          />

          <AppButton
            label="Check Availability"
            variant="outline"
            fullWidth
            onPress={checkAvailability}
            isLoading={isSlotLoading}
          />

          {slotsChecked && !isSlotLoading && (
            <View style={styles.slotsSection}>
              <Text style={styles.sectionTitle}>Available Time Slots</Text>
              {timeSlots.length === 0 ? (
                <Text style={styles.noSlots}>No slots available for this date and guest count.</Text>
              ) : (
                <View style={styles.slotsGrid}>
                  {timeSlots.map((slot, i) => {
                    const active = selectedSlot?.start_time === slot.start_time;
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.slotChip,
                          active && styles.slotChipActive,
                          !slot.available && styles.slotChipDisabled,
                        ]}
                        onPress={() => slot.available && setSelectedSlot(slot)}
                        disabled={!slot.available}
                      >
                        <Text style={[styles.slotText, active && styles.slotTextActive, !slot.available && styles.slotTextDisabled]}>
                          {dateUtils.formatTime(slot.start_time)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          <AppInput
            label="Special Requests (Optional)"
            placeholder="Any dietary requirements?"
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
