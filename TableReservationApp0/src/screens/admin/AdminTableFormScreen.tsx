import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Switch,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AdminStackParamList } from '../../types';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addTableRequest, updateTableRequest } from '../../store/slices/tableSlice';
import { useTheme } from '../../hooks/useTheme';
import { createFormStyles } from '../customer/NewReservationScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, FontSize } from '../../constants/layout';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminTableForm'>;
  route: RouteProp<AdminStackParamList, 'AdminTableForm'>;
};

export const AdminTableFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { tableId } = route.params;
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { list, isLoading } = useAppSelector((s) => s.table);
  const styles = createFormStyles(colors);
  const existing = tableId ? list.find((t) => t.id === tableId) : undefined;

  const [label, setLabel] = useState(existing?.label ?? '');
  const [capacity, setCapacity] = useState(existing?.capacity?.toString() ?? '');
  const [gridRow, setGridRow] = useState(existing?.grid_row?.toString() ?? '');
  const [gridCol, setGridCol] = useState(existing?.grid_col?.toString() ?? '');
  const [isActive, setIsActive] = useState(existing?.is_active ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!label.trim()) e.label = 'Label required';
    if (!capacity || isNaN(Number(capacity)) || Number(capacity) < 1) e.capacity = 'Valid capacity required';
    if (!gridRow || isNaN(Number(gridRow))) e.gridRow = 'Grid row required';
    if (!gridCol || isNaN(Number(gridCol))) e.gridCol = 'Grid col required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      label: label.trim(),
      capacity: Number(capacity),
      grid_row: Number(gridRow),
      grid_col: Number(gridCol),
      is_active: isActive,
    };
    if (tableId) {
      dispatch(updateTableRequest({ id: tableId, payload }));
    } else {
      dispatch(addTableRequest(payload));
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{tableId ? 'Edit Table' : 'Add Table'}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppInput label="Table Label" placeholder="e.g. Table A1" value={label} onChangeText={setLabel} error={errors.label} />
          <AppInput label="Capacity (guests)" placeholder="e.g. 4" value={capacity} onChangeText={setCapacity} keyboardType="numeric" error={errors.capacity} />
          <AppInput label="Grid Row" placeholder="e.g. 1" value={gridRow} onChangeText={setGridRow} keyboardType="numeric" error={errors.gridRow} />
          <AppInput label="Grid Column" placeholder="e.g. 1" value={gridCol} onChangeText={setGridCol} keyboardType="numeric" error={errors.gridCol} />

          {tableId && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md }}>
              <Text style={{ flex: 1, fontSize: FontSize.md, color: colors.text }}>Active</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: colors.border, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          )}

          <AppButton
            label={tableId ? 'Save Changes' : 'Add Table'}
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
