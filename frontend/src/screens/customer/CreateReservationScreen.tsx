import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ExploreStackParams } from '../../navigation/CustomerNavigator';
import { useGetAvailabilityQuery, useCreateReservationMutation, TimeSlot } from '../../store/api/customerApi';
import { Button } from '../../components/ui/Button/Button';
import { styles } from './CreateReservationScreen.styles';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/typography';

type Props = NativeStackScreenProps<ExploreStackParams, 'CreateReservation'>;

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const CreateReservationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { restaurantId } = route.params;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');

  const dateStr = formatDate(selectedDate);

  const { data: availData, isFetching } = useGetAvailabilityQuery({
    restaurantId,
    date: dateStr,
    guestCount,
  });
  const slots: TimeSlot[] = availData?.data ?? [];

  const [createReservation, { isLoading: isCreating }] = useCreateReservationMutation();

  const handleBook = async () => {
    if (!selectedTime) { Alert.alert('Please select a time slot'); return; }
    try {
      await createReservation({
        restaurantId,
        reservationDate: dateStr,
        startTime: selectedTime,
        guestCount,
        specialRequests: specialRequests || undefined,
      }).unwrap();
      Alert.alert('Reservation Created! 🎉', 'Your table has been reserved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      const msg = err?.data?.error?.message ?? 'Could not create reservation.';
      Alert.alert('Booking Failed', msg);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Date picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SELECT DATE</Text>
          <TouchableOpacity style={styles.dateRow} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
            <Text style={styles.dateChange}>Change</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              minimumDate={new Date()}
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) { setSelectedDate(date); setSelectedTime(null); }
              }}
            />
          )}
        </View>

        {/* Guest count */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>GUESTS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.guestRow}>
              {GUEST_OPTIONS.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.guestChip, guestCount === n && styles.guestChipActive]}
                  onPress={() => { setGuestCount(n); setSelectedTime(null); }}
                >
                  <Text style={[styles.guestChipText, guestCount === n && styles.guestChipTextActive]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Time slots */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AVAILABLE TIMES</Text>
          {isFetching ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : (
            <View style={styles.slotsGrid}>
              {slots.map((slot) => (
                <TouchableOpacity
                  key={slot.time}
                  style={[
                    styles.slotChip,
                    !slot.available && styles.slotChipUnavailable,
                    selectedTime === slot.time && styles.slotChipSelected,
                  ]}
                  onPress={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  activeOpacity={slot.available ? 0.75 : 1}
                >
                  <Text style={[
                    styles.slotTime,
                    !slot.available && styles.slotTimeUnavailable,
                    selectedTime === slot.time && styles.slotTimeSelected,
                  ]}>
                    {slot.time}
                  </Text>
                  {slot.available && (
                    <Text style={[styles.slotCount, selectedTime === slot.time && styles.slotCountSelected]}>
                      {slot.tableCount} table{slot.tableCount !== 1 ? 's' : ''}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Book button */}
        {selectedTime && (
          <View style={styles.bookSection}>
            <View style={styles.bookSummary}>
              <Text style={styles.bookSummaryText}>
                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {' · '}{selectedTime}{' · '}{guestCount} guest{guestCount > 1 ? 's' : ''}
              </Text>
            </View>
            <Button label="Reserve Table" onPress={handleBook} loading={isCreating} fullWidth />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};