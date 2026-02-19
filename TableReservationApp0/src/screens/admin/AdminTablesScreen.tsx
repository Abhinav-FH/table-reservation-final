import React, { useEffect } from 'react';
import {
  View, Text, FlatList, SafeAreaView, RefreshControl, TouchableOpacity, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchTablesRequest, removeTableRequest } from '../../store/slices/tableSlice';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { EmptyState } from '../../components/common/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { createTablesStyles } from './AdminTablesScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../components/common/AppButton';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminTabs'>;
};

export const AdminTablesScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { list, isLoading } = useAppSelector((s) => s.table);
  const styles = createTablesStyles(colors);

  useEffect(() => { dispatch(fetchTablesRequest()); }, []);

  const handleDelete = (id: number, label: string) => {
    Alert.alert('Remove Table', `Remove "${label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => dispatch(removeTableRequest(id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Tables</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AdminFloorPlan')}
            style={styles.iconBtn}
          >
            <Ionicons name="grid-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AdminTableForm', {})}
            style={styles.iconBtn}
          >
            <Ionicons name="add-circle" size={28} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && list.length === 0 ? (
        <LoadingOverlay />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <View style={[styles.statusDot, { backgroundColor: item.is_active ? Colors.success : Colors.error }]} />
              <View style={styles.tableInfo}>
                <Text style={styles.tableLabel}>{item.label}</Text>
                <Text style={styles.tableMeta}>Capacity: {item.capacity} · Row {item.grid_row}, Col {item.grid_col}</Text>
                <Text style={[styles.tableStatus, { color: item.is_active ? Colors.success : Colors.error }]}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
              <View style={styles.tableActions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AdminTableForm', { tableId: item.id })}
                  style={styles.actionBtn}
                >
                  <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.label)}
                  style={styles.actionBtn}
                >
                  <Ionicons name="trash-outline" size={18} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="grid-outline"
              title="No tables"
              message="Add tables to start accepting reservations."
              actionLabel="Add Table"
              onAction={() => navigation.navigate('AdminTableForm', {})}
            />
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={() => dispatch(fetchTablesRequest())} tintColor={Colors.primary} />
          }
        />
      )}
    </SafeAreaView>
  );
};
