import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchFloorPlanRequest, fetchTablesRequest } from '../../store/slices/tableSlice';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { EmptyState } from '../../components/common/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { createFloorPlanStyles } from './AdminFloorPlanScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Table } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminFloorPlan'>;
};

// Build a 2D grid from flat table list using grid_row / grid_col
function buildGridFromList(tables: Table[], rows: number, cols: number): (Table | null)[][] {
  const grid: (Table | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  tables.forEach((t) => {
    const r = t.gridRow ?? 0;
    const c = t.gridCol ?? 0;
    if (r < rows && c < cols) grid[r][c] = t;
  });
  return grid;
}

export const AdminFloorPlanScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  // floorPlan may be undefined / empty — always default to []
  const { floorPlan = [], list, isLoading } = useAppSelector((s) => s.table);
  const { adminRestaurant } = useAppSelector((s) => s.restaurant);
  const styles = createFloorPlanStyles(colors);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    dispatch(fetchFloorPlanRequest(today));
    dispatch(fetchTablesRequest()); // also load flat list as fallback
  }, []);

  // Use floor plan from API; if it's empty/undefined, build one from the flat list
  const safeFloorPlan = Array.isArray(floorPlan) && floorPlan.length > 0
    ? floorPlan
    : buildGridFromList(
        list,
        Math.max(...list.map((t) => (t.gridRow ?? 0) + 1), adminRestaurant?.gridRows ?? 5, 1),
        Math.max(...list.map((t) => (t.gridCol ?? 0) + 1), adminRestaurant?.gridCols ?? 5, 1),
      );

  const getTableColor = (table: Table) => {
    if (!table.isActive) return colors.border;
    if (table.status === 'reserved') return Colors.error;
    return Colors.success;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Floor Plan</Text>
      </View>

      {isLoading && list.length === 0 ? (
        <LoadingOverlay />
      ) : list.length === 0 ? (
        <EmptyState
          icon="grid-outline"
          title="No tables yet"
          message="Add tables from the Tables screen to see them here."
          actionLabel="Add Tables"
          onAction={() => navigation.navigate('AdminTableForm', {})}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
              <Text style={styles.legendText}>Reserved</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
              <Text style={styles.legendText}>Inactive</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.grid}>
              {safeFloorPlan.map((row, rowIdx) => (
                <View key={`row-${rowIdx}`} style={styles.gridRow}>
                  {(Array.isArray(row) ? row : []).map((table, colIdx) =>
                    table ? (
                      <View
                        key={`table-${table.id}`}
                        style={[styles.tableCell, { borderColor: getTableColor(table) }]}
                      >
                        <Text style={styles.tableCellLabel}>{table.label}</Text>
                        <Text style={styles.tableCellCapacity}>👥 {table.capacity}</Text>
                      </View>
                    ) : (
                      <View key={`empty-${rowIdx}-${colIdx}`} style={styles.emptyCell} />
                    ),
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};