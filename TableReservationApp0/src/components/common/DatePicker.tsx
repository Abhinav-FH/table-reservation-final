import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';

interface Props {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  error?: string;
}

const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const { width } = Dimensions.get('window');

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseYMD(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function displayFmt(ymd: string): string {
  if (!ymd) return '';
  const d = parseYMD(ymd);
  return `${MONTHS_FULL[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export const DatePicker: React.FC<Props> = ({ label, value, onChange, error }) => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);

  const init = value ? parseYMD(value) : today;
  const [viewYear, setViewYear] = useState(init.getFullYear());
  const [viewMonth, setViewMonth] = useState(init.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today || d > maxDate) return;
    onChange(toYMD(d));
    setOpen(false);
  };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d < today || d > maxDate;
  };
  const isSelected = (day: number) => value === toYMD(new Date(viewYear, viewMonth, day));
  const isTodayCell = (day: number) => toYMD(new Date(viewYear, viewMonth, day)) === toYMD(today);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const s = StyleSheet.create({
    container: { marginBottom: Spacing.md },
    label: {
      fontSize: FontSize.sm, fontWeight: FontWeight.medium,
      color: colors.textSecondary, marginBottom: 6,
    },
    trigger: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.inputBackground, borderRadius: BorderRadius.md,
      borderWidth: 1.5, borderColor: error ? Colors.error : colors.border,
      paddingHorizontal: Spacing.md, height: 52,
    },
    triggerText: {
      flex: 1, fontSize: FontSize.md,
      color: value ? colors.text : colors.textMuted, marginLeft: 8,
    },
    errorTxt: { fontSize: FontSize.xs, color: Colors.error, marginTop: 4 },
    overlay: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.52)',
      justifyContent: 'center', alignItems: 'center', padding: 20,
    },
    modal: {
      backgroundColor: colors.card, borderRadius: 20,
      width: Math.min(width - 40, 340), overflow: 'hidden',
    },
    hdr: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: 4,
    },
    navBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.surfaceSecondary,
      justifyContent: 'center', alignItems: 'center',
    },
    monthYear: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: colors.text },
    weekRow: { flexDirection: 'row', paddingHorizontal: 8, paddingBottom: 4 },
    weekDay: {
      flex: 1, textAlign: 'center', fontSize: 11,
      fontWeight: FontWeight.semibold, color: colors.textMuted,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, paddingBottom: 8 },
    cell: {
      width: `${100 / 7}%`, aspectRatio: 1,
      justifyContent: 'center', alignItems: 'center', borderRadius: 100,
    },
    cellSelected: { backgroundColor: Colors.primary },
    cellToday: { backgroundColor: Colors.errorLight },
    cellDisabled: { opacity: 0.25 },
    cellText: { fontSize: FontSize.sm, color: colors.text, fontWeight: FontWeight.medium },
    cellTextSelected: { color: Colors.white, fontWeight: FontWeight.bold },
    cellTextToday: { color: Colors.primary, fontWeight: FontWeight.bold },
    footer: {
      borderTopWidth: 1, borderTopColor: colors.border,
      paddingHorizontal: Spacing.md, paddingVertical: 10,
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    footerNote: { fontSize: 11, color: colors.textMuted },
    cancelTxt: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  });

  return (
    <View style={s.container}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TouchableOpacity style={s.trigger} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Ionicons name="calendar-outline" size={18} color={value ? Colors.primary : colors.textMuted} />
        <Text style={s.triggerText}>{value ? displayFmt(value) : 'Select a date'}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </TouchableOpacity>
      {error ? <Text style={s.errorTxt}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={s.modal}>
            <View style={s.hdr}>
              <TouchableOpacity style={s.navBtn} onPress={prevMonth}>
                <Ionicons name="chevron-back" size={18} color={colors.text} />
              </TouchableOpacity>
              <Text style={s.monthYear}>{MONTHS_FULL[viewMonth]} {viewYear}</Text>
              <TouchableOpacity style={s.navBtn} onPress={nextMonth}>
                <Ionicons name="chevron-forward" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={s.weekRow}>
              {WEEKDAYS.map((d, i) => <Text key={i} style={s.weekDay}>{d}</Text>)}
            </View>

            <View style={s.grid}>
              {cells.map((day, i) => {
                if (!day) return <View key={`e${i}`} style={s.cell} />;
                const disabled = isDisabled(day);
                const selected = isSelected(day);
                const todayCell = isTodayCell(day);
                return (
                  <TouchableOpacity
                    key={`d${day}`}
                    style={[
                      s.cell,
                      selected && s.cellSelected,
                      todayCell && !selected && s.cellToday,
                      disabled && s.cellDisabled,
                    ]}
                    onPress={() => selectDay(day)}
                    disabled={disabled}
                  >
                    <Text style={[
                      s.cellText,
                      selected && s.cellTextSelected,
                      todayCell && !selected && s.cellTextToday,
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={s.footer}>
              <Text style={s.footerNote}>Today → next 30 days only</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={s.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};