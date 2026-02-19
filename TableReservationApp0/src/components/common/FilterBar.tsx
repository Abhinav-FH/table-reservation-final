import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { createFilterBarStyles } from './FilterBar.styles';
import { ReservationStatus } from '../../types';
import { Colors } from '../../constants/colors';

const STATUS_OPTIONS: Array<{ label: string; value: ReservationStatus | '' }> = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Completed', value: 'COMPLETED' },
];

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedStatus: ReservationStatus | '';
  onStatusChange: (v: ReservationStatus | '') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}) => {
  const { colors } = useTheme();
  const styles = createFilterBarStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={16} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search reservations..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={onSearchChange}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsRow}>
        {STATUS_OPTIONS.map((option) => {
          const active = selectedStatus === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => onStatusChange(option.value)}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
