import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  ViewToken,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ExploreStackParams } from '../../navigation/CustomerNavigator';
import {
  useGetAvailabilityQuery,
  useCreateReservationMutation,
  TimeSlot,
} from '../../store/api/customerApi';
import { Button } from '../../components/ui/Button/Button';
import { styles, SLOT_ITEM_HEIGHT } from './CreateReservationScreen.styles';
import { Colors } from '../../styles/colors';

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

  const flatListRef = useRef<FlatList>(null);

  const dateStr = formatDate(selectedDate);

  const { data: availData, isFetching } = useGetAvailabilityQuery({
    restaurantId,
    date: dateStr,
    guestCount,
  });

  const slots: TimeSlot[] = availData?.data ?? [];
  const availableSlots = slots.filter((s) => s.available);

  const [createReservation, { isLoading: isCreating }] = useCreateReservationMutation();

  const handleBook = async () => {
    if (!selectedTime) {
      Alert.alert('No Time Selected', 'Please scroll and pick a time slot.');
      return;
    }
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

  // ── Scrollable time drum ─────────────────────────────────────────────────────
  const renderTimeSlot = ({ item }: { item: TimeSlot }) => {
    const isSelected = selectedTime === item.time;
    const isUnavailable = !item.available;

    return (
      <TouchableOpacity
        style={[
          styles.slotItem,
          isSelected && styles.slotItemSelected,
          isUnavailable && styles.slotItemUnavailable,
        ]}
        onPress={() => {
          if (!isUnavailable) setSelectedTime(item.time);
        }}
        disabled={isUnavailable}
        activeOpacity={isUnavailable ? 1 : 0.75}
      >
        <Text
          style={[
            styles.slotTime,
            isSelected && styles.slotTimeSelected,
            isUnavailable && styles.slotTimeUnavailable,
          ]}
        >
          {item.time}
        </Text>
        <Text
          style={[
            styles.slotMeta,
            isSelected && styles.slotMetaSelected,
            isUnavailable && styles.slotMetaUnavailable,
          ]}
        >
          {isUnavailable
            ? 'Unavailable'
            : ``}
        </Text>
        {isSelected && <View style={styles.slotSelectedDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Date ─────────────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SELECT DATE</Text>
          <TouchableOpacity style={styles.dateRow} onPress={() => setShowDatePicker(true)}>
            <View>
              <Text style={styles.dateText}>
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.dateYear}>{selectedDate.getFullYear()}</Text>
            </View>
            <View style={styles.changePill}>
              <Text style={styles.changeText}>Change</Text>
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              minimumDate={new Date()}
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }
              }}
            />
          )}
        </View>

        {/* ── Guests ───────────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            GUESTS — <Text style={styles.sectionLabelAccent}>{guestCount} selected</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.guestRow}>
              {GUEST_OPTIONS.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.guestChip, guestCount === n && styles.guestChipActive]}
                  onPress={() => {
                    setGuestCount(n);
                    setSelectedTime(null);
                  }}
                >
                  <Text
                    style={[
                      styles.guestChipText,
                      guestCount === n && styles.guestChipTextActive,
                    ]}
                  >
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* ── Time scroll drum ─────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            SELECT TIME
            {selectedTime ? (
              <Text style={styles.sectionLabelAccent}> — {selectedTime}</Text>
            ) : (
              <Text style={styles.sectionLabelHint}> — scroll to pick</Text>
            )}
          </Text>

          {isFetching ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : slots.length === 0 ? (
            <View style={styles.noSlotsBox}>
              <Text style={styles.noSlotsText}>No time slots available for this date.</Text>
            </View>
          ) : (
            <View style={styles.drumWrapper}>
              {/* Highlight bar behind center item */}
              <View style={styles.drumHighlight} pointerEvents="none" />

              <FlatList
                ref={flatListRef}
                data={slots}
                keyExtractor={(s) => s.time}
                renderItem={renderTimeSlot}
                showsVerticalScrollIndicator={false}
                snapToInterval={SLOT_ITEM_HEIGHT}
                decelerationRate="fast"
                style={styles.drum}
                contentContainerStyle={styles.drumContent}
                getItemLayout={(_, index) => ({
                  length: SLOT_ITEM_HEIGHT,
                  offset: SLOT_ITEM_HEIGHT * index,
                  index,
                })}
                // Auto-scroll to selected time when slots load
                onLayout={() => {
                  if (selectedTime) {
                    const idx = slots.findIndex((s) => s.time === selectedTime);
                    if (idx > -1) {
                      flatListRef.current?.scrollToIndex({ index: idx, animated: false });
                    }
                  }
                }}
              />

              {/* Top/bottom fade overlays */}
              <View style={styles.drumFadeTop} pointerEvents="none" />
              <View style={styles.drumFadeBottom} pointerEvents="none" />
            </View>
          )}
        </View>

        {/* ── Book summary + button ────────────────────────────────────────── */}
        {selectedTime && (
          <View style={styles.bookSection}>
            <View style={styles.bookSummary}>
              <View style={styles.bookSummaryItem}>
                <Text style={styles.bookSummaryLabel}>DATE</Text>
                <Text style={styles.bookSummaryValue}>
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </View>
              <View style={styles.bookSummarySep} />
              <View style={styles.bookSummaryItem}>
                <Text style={styles.bookSummaryLabel}>TIME</Text>
                <Text style={styles.bookSummaryValue}>{selectedTime}</Text>
              </View>
              <View style={styles.bookSummarySep} />
              <View style={styles.bookSummaryItem}>
                <Text style={styles.bookSummaryLabel}>GUESTS</Text>
                <Text style={styles.bookSummaryValue}>{guestCount}</Text>
              </View>
            </View>
            <Button
              label="Reserve Table"
              onPress={handleBook}
              loading={isCreating}
              fullWidth
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};