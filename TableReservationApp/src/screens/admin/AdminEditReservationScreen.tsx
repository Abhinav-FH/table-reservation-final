import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AdminStackParamList, TimeSlot } from '../../types';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  fetchAdminReservationByIdRequest,
  adminUpdateReservationRequest,
  fetchAvailabilityRequest,
  clearTimeSlots,
} from '../../store/slices/reservationSlice';
import { useTheme } from '../../hooks/useTheme';
import { createFormStyles } from '../customer/NewReservationScreen.styles';
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
  const [guestCount, setGuestCount] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [slotsChecked, setSlotsChecked] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminReservationByIdRequest(reservationId));
    return () => {
      dispatch(clearTimeSlots());
    };
  }, []);

  useEffect(() => {
    if (selected) {
      setDate(selected.reservation_date);
      setGuestCount(selected.guest_count.toString());
      setSpecialRequests(selected.special_requests ?? '');
      setSelectedSlot({
        start_time: selected.start_time,
        end_time: selected.end_time,
        available: true,
        available_tables: 1,
      });
    }
  }, [selected]);

  if (!selected) return <LoadingOverlay fullScreen />;

  const checkAvailability = () => {
    setSlotsChecked(true);
    setSelectedSlot(null);
    dispatch(fetchAvailabilityRequest({
      restaurantId: selected.restaurant_id,
      date,
      guestCount: Number(guestCount),
    }));
  };

  const handleSubmit = () => {
    if (!selectedSlot) {
      Toast.show({ type: 'error', text1: 'Select a time slot' });
      return;
    }
    dispatch(adminUpdateReservationRequest({
      id: reservationId,
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Reservation #{reservationId}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppInput
            label="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            leftIcon="calendar-outline"
          />
          <AppInput
            label="Number of Guests"
            value={guestCount}
            onChangeText={setGuestCount}
            keyboardType="numeric"
            leftIcon="people-outline"
          />
          <AppInput
            label="Special Requests"
            value={specialRequests}
            onChangeText={setSpecialRequests}
            multiline
            style={styles.textarea}
          />

          <AppButton
            label="Check Availability"
            variant="outline"
            fullWidth
            onPress={checkAvailability}
            isLoading={isSlotLoading}
          />

          {slotsChecked && !isSlotLoading && timeSlots.length > 0 && (
            <View style={styles.slotsSection}>
              <Text style={styles.sectionTitle}>Time Slots</Text>
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
                      <Text style={[styles.slotText, active && styles.slotTextActive]}>
                        {dateUtils.formatTime(slot.start_time)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <AppButton
            label="Save Changes"
            fullWidth
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
