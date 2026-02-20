import React, { useEffect } from 'react';
import {
  View, Text, FlatList, SafeAreaView, RefreshControl,
  TouchableOpacity, Alert, StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchTablesRequest, removeTableRequest } from '../../store/slices/tableSlice';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { EmptyState } from '../../components/common/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/layout';
import Toast from 'react-native-toast-message';

const MAX_TABLES = 10;

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminTabs'>;
};

export const AdminTablesScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { list, isLoading } = useAppSelector((s) => s.table);

  useEffect(() => { dispatch(fetchTablesRequest()); }, []);

  const activeTables = list.filter((t) => t.isActive);
  const inactiveTables = list.filter((t) => !t.isActive);

  const handleDelete = (id: number, label: string) => {
    Alert.alert('Remove Table', `Remove "${label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => dispatch(removeTableRequest(id)) },
    ]);
  };

  const handleAddTable = () => {
    if (list.length >= MAX_TABLES) {
      Toast.show({
        type: 'error',
        text1: 'Table Limit Reached',
        text2: `A restaurant can have a maximum of ${MAX_TABLES} tables.`,
      });
      return;
    }
    navigation.navigate('AdminTableForm', {});
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    heading: { fontSize: 24, fontWeight: FontWeight.bold, color: colors.text },
    subheading: { fontSize: FontSize.sm, color: colors.textSecondary, marginTop: 2 },
    limitBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      backgroundColor: list.length >= MAX_TABLES ? Colors.errorLight : Colors.successLight,
      paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: BorderRadius.full,
    },
    limitText: {
      fontSize: FontSize.sm,
      color: list.length >= MAX_TABLES ? Colors.error : Colors.success,
      fontWeight: FontWeight.semibold,
    },
    floorBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      borderWidth: 1, borderColor: colors.border,
      paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: BorderRadius.full,
    },
    floorBtnTxt: { fontSize: FontSize.sm, color: colors.text, fontWeight: FontWeight.medium },
    topActions: { flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
    list: { padding: Spacing.md, paddingBottom: 100 },
    sectionHeader: {
      fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
      color: colors.textMuted, letterSpacing: 0.8,
      marginBottom: 8, marginTop: 4,
    },
    card: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.card, borderRadius: BorderRadius.lg,
      padding: Spacing.md, marginBottom: 10,
      ...Shadow.small, shadowColor: colors.shadow,
    },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.md },
    tableLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: colors.text },
    capacity: { fontSize: FontSize.sm, color: colors.textSecondary, marginTop: 2 },
    actions: { flexDirection: 'row', gap: 4 },
    actionBtn: { padding: 8, borderRadius: BorderRadius.sm },
    fab: {
      position: 'absolute', bottom: 28, right: 24,
      width: 58, height: 58, borderRadius: 29,
      backgroundColor: list.length >= MAX_TABLES ? colors.textMuted : Colors.primary,
      justifyContent: 'center', alignItems: 'center',
      shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
      shadowOpacity: list.length >= MAX_TABLES ? 0 : 0.4, shadowRadius: 12, elevation: 10,
    },
  });

  const renderTable = ({ item }: any) => (
    <View style={s.card}>
      <View style={[s.dot, { backgroundColor: item.is_active ? Colors.success : colors.textMuted }]} />
      <View style={{ flex: 1 }}>
        <Text style={s.tableLabel}>{item.label}</Text>
        <Text style={s.capacity}>
          Up to {item.capacity} {item.capacity === 1 ? 'guest' : 'guests'} · {item.is_active ? 'Active' : 'Inactive'}
        </Text>
      </View>
      <View style={s.actions}>
        <TouchableOpacity style={s.actionBtn} onPress={() => navigation.navigate('AdminTableForm', { tableId: item.id })}>
          <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={() => handleDelete(item.id, item.label)}>
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.heading}>Tables</Text>
          <Text style={s.subheading}>{activeTables.length} active · {inactiveTables.length} inactive</Text>
        </View>
        {/* Table count / limit badge */}
        <View style={s.limitBadge}>
          <Ionicons
            name={list.length >= MAX_TABLES ? 'lock-closed-outline' : 'restaurant-outline'}
            size={13}
            color={list.length >= MAX_TABLES ? Colors.error : Colors.success}
          />
          <Text style={s.limitText}>{list.length}/{MAX_TABLES}</Text>
        </View>
      </View>

      {/* Floor plan button */}
      <View style={s.topActions}>
        <TouchableOpacity style={s.floorBtn} onPress={() => navigation.navigate('AdminFloorPlan')}>
          <Ionicons name="map-outline" size={15} color={colors.text} />
          <Text style={s.floorBtnTxt}>Floor Plan</Text>
        </TouchableOpacity>
      </View>

      {isLoading && list.length === 0 ? (
        <LoadingOverlay />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTable}
          contentContainerStyle={[s.list, list.length === 0 && { flex: 1 }]}
          ListEmptyComponent={
            <EmptyState
              icon="restaurant-outline"
              title="No tables yet"
              message="Tap + below to add your first table."
            />
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={() => dispatch(fetchTablesRequest())} tintColor={Colors.primary} />
          }
        />
      )}

      <TouchableOpacity style={s.fab} onPress={handleAddTable} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};