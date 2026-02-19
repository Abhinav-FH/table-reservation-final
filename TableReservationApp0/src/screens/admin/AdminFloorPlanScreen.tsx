import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchFloorPlanRequest } from '../../store/slices/tableSlice';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { useTheme } from '../../hooks/useTheme';
import { createFloorPlanStyles } from './AdminFloorPlanScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminFloorPlan'>;
};

export const AdminFloorPlanScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { floorPlan, isLoading } = useAppSelector((s) => s.table);
  const { adminRestaurant } = useAppSelector((s) => s.restaurant);
  const styles = createFloorPlanStyles(colors);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    dispatch(fetchFloorPlanRequest(today));
  }, []);

  const getTableColor = (status?: string) => {
    switch (status) {
      case 'reserved': return Colors.error;
      case 'available': return Colors.success;
      default: return colors.border;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Floor Plan</Text>
      </View>

      {isLoading ? (
        <LoadingOverlay />
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
              {floorPlan.map((row, rowIdx) => (
                <View key={rowIdx} style={styles.gridRow}>
                  {row.map((table, colIdx) =>
                    table ? (
                      <View
                        key={table.id}
                        style={[styles.tableCell, { borderColor: getTableColor(table.status) }]}
                      >
                        <Text style={styles.tableCellLabel}>{table.label}</Text>
                        <Text style={styles.tableCellCapacity}>👥 {table.capacity}</Text>
                      </View>
                    ) : (
                      <View key={colIdx} style={styles.emptyCell} />
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
