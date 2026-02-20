import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';

interface Props {
  label?: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  error?: string;
}

export const GuestPicker: React.FC<Props> = ({
  label = 'Number of Guests',
  value,
  onChange,
  min = 1,
  max = 12,
  error,
}) => {
  const { colors } = useTheme();

  const s = StyleSheet.create({
    container: { marginBottom: Spacing.md },
    label: {
      fontSize: FontSize.sm, fontWeight: FontWeight.medium,
      color: colors.textSecondary, marginBottom: 6,
    },
    row: {
      flexDirection: 'row', alignItems: 'center',
      borderRadius: BorderRadius.md, borderWidth: 1.5,
      borderColor: error ? Colors.error : colors.border,
      backgroundColor: colors.inputBackground, overflow: 'hidden',
    },
    btn: {
      width: 52, height: 52,
      justifyContent: 'center', alignItems: 'center',
      backgroundColor: Colors.primary,
    },
    btnDisabled: { backgroundColor: colors.surfaceSecondary },
    center: {
      flex: 1, flexDirection: 'row',
      alignItems: 'center', justifyContent: 'center',
    },
    num: {
      fontSize: 24, fontWeight: FontWeight.bold,
      color: colors.text, marginRight: 5,
    },
    unit: {
      fontSize: FontSize.sm, color: colors.textSecondary,
      alignSelf: 'flex-end', paddingBottom: 3,
    },
    icon: { marginRight: 8 },
    errorTxt: { fontSize: FontSize.xs, color: Colors.error, marginTop: 4 },
  });

  return (
    <View style={s.container}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <View style={s.row}>
        <TouchableOpacity
          style={[s.btn, value <= min && s.btnDisabled]}
          onPress={() => value > min && onChange(value - 1)}
          disabled={value <= min}
        >
          <Ionicons name="remove" size={22} color={value <= min ? colors.textMuted : Colors.white} />
        </TouchableOpacity>

        <View style={s.center}>
          <Ionicons name="people" size={18} color={colors.textSecondary} style={s.icon} />
          <Text style={s.num}>{value}</Text>
          <Text style={s.unit}>{value === 1 ? 'guest' : 'guests'}</Text>
        </View>

        <TouchableOpacity
          style={[s.btn, value >= max && s.btnDisabled]}
          onPress={() => value < max && onChange(value + 1)}
          disabled={value >= max}
        >
          <Ionicons name="add" size={22} color={value >= max ? colors.textMuted : Colors.white} />
        </TouchableOpacity>
      </View>
      {error ? <Text style={s.errorTxt}>{error}</Text> : null}
    </View>
  );
};