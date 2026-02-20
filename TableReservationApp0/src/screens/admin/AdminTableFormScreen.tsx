import React, { useState } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Switch, StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AdminStackParamList } from '../../types';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { GuestPicker } from '../../components/common/GuestPicker';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addTableRequest, updateTableRequest } from '../../store/slices/tableSlice';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/layout';
import Toast from 'react-native-toast-message';

const MAX_TABLES = 10;

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminTableForm'>;
  route: RouteProp<AdminStackParamList, 'AdminTableForm'>;
};

export const AdminTableFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { tableId } = route.params ?? {};
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { list, isLoading } = useAppSelector((s) => s.table);
  const { adminRestaurant } = useAppSelector((s) => s.restaurant);
  const existing = tableId ? list.find((t) => t.id === tableId) : undefined;
  const isEditing = !!existing;

  const [label, setLabel] = useState(existing?.label ?? '');
  const [capacity, setCapacity] = useState(existing?.capacity ?? 2);
  const [isActive, setIsActive] = useState(existing?.isActive ?? true);
  const [labelError, setLabelError] = useState('');

  // Auto-place table in next available grid cell
  const autoPosition = () => {
    const cols = Number(
      (adminRestaurant as any)?.gridCols ??
      (adminRestaurant as any)?.grid_cols ??
      5
    );
    const idx = list.length;
    return { grid_row: Math.floor(idx / cols), grid_col: idx % cols };
  };

  const handleSubmit = () => {
    if (!label.trim()) { setLabelError('Table name is required'); return; }

    if (!isEditing && list.length >= MAX_TABLES) {
      Toast.show({ type: 'error', text1: 'Table Limit Reached', text2: `Maximum ${MAX_TABLES} tables per restaurant.` });
      return;
    }

    setLabelError('');

    if (isEditing) {
      dispatch(updateTableRequest({
        id: tableId!,
        payload: {
          label: label.trim(),
          capacity,
          isActive: isActive,
          gridRow: existing!.gridRow,
          gridCol: existing!.gridCol,
        },
      }));
    } else {
      const pos = autoPosition();
      dispatch(addTableRequest({
        label: label.trim(),
        capacity,
        isActive: true,  // always active on creation
        ...pos,
      }));
    }
    navigation.goBack();
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backBtn: { padding: Spacing.xs, marginRight: Spacing.sm },
    title: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: colors.text },
    content: { padding: Spacing.md, paddingBottom: 80 },
    switchRow: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.inputBackground, borderRadius: BorderRadius.md,
      borderWidth: 1.5, borderColor: colors.border,
      paddingHorizontal: Spacing.md, paddingVertical: 14, marginBottom: Spacing.md,
    },
    switchLabelWrap: { flex: 1, marginLeft: Spacing.md },
    switchLabel: { fontSize: FontSize.md, color: colors.text, fontWeight: FontWeight.medium },
    switchSub: { fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 },
    hint: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 8,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md,
    },
    hintText: { fontSize: FontSize.xs, color: colors.textSecondary, flex: 1, lineHeight: 18 },
  });

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={s.title}>{isEditing ? 'Edit Table' : 'Add New Table'}</Text>
        </View>

        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <AppInput
            label="Table Name"
            placeholder='e.g. "Window Seat", "Table 4", "Patio A"'
            value={label}
            onChangeText={(t) => { setLabel(t); setLabelError(''); }}
            leftIcon="restaurant-outline"
            error={labelError}
          />

          {/* Capacity stepper — min 1, max 20, increments by 1 */}
          <GuestPicker
            label="Seating Capacity"
            value={capacity}
            onChange={setCapacity}
            min={1}
            max={20}
          />

          {/* Active toggle — only when editing */}
          {isEditing && (
            <View style={s.switchRow}>
              <Ionicons name="power-outline" size={18} color={colors.textSecondary} />
              <View style={s.switchLabelWrap}>
                <Text style={s.switchLabel}>Table Active</Text>
                <Text style={s.switchSub}>Inactive tables won't appear in new bookings</Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: colors.border, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          )}

          {!isEditing && (
            <View style={s.hint}>
              <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
              <Text style={s.hintText}>
                Table will be automatically placed on the floor plan and set as active.
                {list.length >= MAX_TABLES - 1
                  ? ` You have ${list.length}/${MAX_TABLES} tables. This is your last available slot.`
                  : ` You have ${list.length}/${MAX_TABLES} tables.`}
              </Text>
            </View>
          )}

          <AppButton
            label={isEditing ? 'Save Changes' : 'Add Table'}
            fullWidth
            onPress={handleSubmit}
            isLoading={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};