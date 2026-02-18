import React, { useState } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetFloorPlanQuery, useUpdateTableMutation, useDeleteTableMutation, FloorPlanTable } from '../../store/api/adminApi';
import { useAppDispatch } from '../../hooks/useRedux';
import { logout } from '../../store/slices/authSlice';
import { FloorPlanGrid } from '../../components/floor-plan/FloorPlanGrid';
import { styles } from './FloorPlanScreen.styles';
import { Colors } from '../../styles/colors';

const formatToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const FloorPlanScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [date] = useState(formatToday());
  const [selectedTable, setSelectedTable] = useState<FloorPlanTable | null>(null);

  const { data, isLoading, refetch } = useGetFloorPlanQuery(date);
  const [updateTable] = useUpdateTableMutation();
  const [deleteTable] = useDeleteTableMutation();

  const floorData = data?.data;
  const restaurant = floorData?.restaurant;
  const grid = floorData?.grid ?? [];

  const handleTablePress = (table: FloorPlanTable) => {
    setSelectedTable(table);
  };

  const handleToggleActive = async () => {
    if (!selectedTable) return;
    try {
      await updateTable({ id: selectedTable.id, is_active: !selectedTable.is_active }).unwrap();
      setSelectedTable(null);
      refetch();
    } catch {
      Alert.alert('Error', 'Could not update table status.');
    }
  };

  const handleDelete = () => {
    if (!selectedTable) return;
    Alert.alert('Delete Table', `Remove table "${selectedTable.label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTable(selectedTable.id).unwrap();
            setSelectedTable(null);
            refetch();
          } catch (err: any) {
            Alert.alert('Error', err?.data?.error?.message ?? 'Could not delete table.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>FLOOR PLAN</Text>
            <Text style={styles.restaurantName}>{restaurant?.name ?? '—'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
            <Ionicons name="log-out-outline" size={22} color={Colors.textDarkMuted} />
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {[
            { color: Colors.tableAvailable, label: 'Available' },
            { color: Colors.tableBooked, label: 'Booked' },
            { color: Colors.tableDisabled, label: 'Inactive' },
          ].map(({ color, label }) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Grid */}
        {isLoading ? (
          <ActivityIndicator color={Colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.gridContainer}>
            <FloorPlanGrid
              grid={grid}
              gridRows={restaurant?.grid_rows ?? 4}
              gridCols={restaurant?.grid_cols ?? 5}
              selectedTableIds={selectedTable ? [selectedTable.id] : []}
              onTablePress={handleTablePress}
              isSelectable
            />
          </View>
        )}

        {/* Selected table panel */}
        {selectedTable && (
          <View style={styles.tablePanel}>
            <View style={styles.tablePanelHeader}>
              <Text style={styles.tablePanelTitle}>{selectedTable.label}</Text>
              <TouchableOpacity onPress={() => setSelectedTable(null)}>
                <Ionicons name="close" size={20} color={Colors.textDarkSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.tablePanelDetail}>Capacity: {selectedTable.capacity} seats</Text>
            <Text style={styles.tablePanelDetail}>
              Status: {selectedTable.is_active ? selectedTable.status : 'inactive'}
            </Text>
            <View style={styles.tablePanelActions}>
              <TouchableOpacity style={styles.panelBtn} onPress={handleToggleActive}>
                <Text style={styles.panelBtnText}>
                  {selectedTable.is_active ? 'Deactivate' : 'Activate'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.panelBtn, styles.panelBtnDanger]} onPress={handleDelete}>
                <Text style={[styles.panelBtnText, styles.panelBtnTextDanger]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};