import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useGetFloorPlanQuery,
  useGetAdminRestaurantQuery,
  useCreateRestaurantMutation,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  FloorPlanTable,
} from '../../store/api/adminApi';
import { useAppDispatch } from '../../hooks/useRedux';
import { logout } from '../../store/slices/authSlice';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { styles } from './FloorPlanScreen.styles';
import { Colors } from '../../styles/colors';
import { Spacing } from '../../styles/spacing';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getStatusColor = (table: FloorPlanTable, isSelected: boolean): string => {
  if (isSelected) return Colors.primary;
  if (!table.is_active) return Colors.tableDisabled;
  if (table.status === 'booked') return Colors.tableBooked;
  return Colors.tableAvailable;
};

// ─────────────────────────────────────────────────────────────────────────────
// Chair sub-component
// ─────────────────────────────────────────────────────────────────────────────

const Chair: React.FC<{ size: number; color: string; style?: object }> = ({ size, color, style }) => (
  <View
    style={[
      {
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundColor: color,
        opacity: 0.8,
      },
      style,
    ]}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// TableShape — existing occupied cell
// ─────────────────────────────────────────────────────────────────────────────

interface TableShapeProps {
  table: FloorPlanTable;
  cellSize: number;
  isSelected: boolean;
  onPress: (t: FloorPlanTable) => void;
}

const TableShape: React.FC<TableShapeProps> = ({ table, cellSize, isSelected, onPress }) => {
  const color = getStatusColor(table, isSelected);
  const bgColor = color + '22';
  const chairSize = Math.max(cellSize * 0.10, 6);
  const chairGap = cellSize * 0.04;
  const tableW = cellSize * 0.54;
  const tableH = table.capacity === 2 ? cellSize * 0.36 : cellSize * 0.46;
  const topChairs = table.capacity === 6 ? 2 : 1;
  const bottomChairs = table.capacity === 6 ? 2 : 1;
  const sideChairs = table.capacity >= 4 ? 1 : 0;

  const renderRowChairs = (count: number) =>
    Array.from({ length: count }, (_, i) => (
      <Chair key={i} size={chairSize} color={color} style={{ marginHorizontal: chairGap / 2 }} />
    ));

  return (
    <TouchableOpacity
      onPress={() => onPress(table)}
      activeOpacity={0.75}
      style={[styles.tableShapeWrapper, { width: cellSize, height: cellSize }]}
    >
      <View style={[styles.chairRow, { marginBottom: chairGap }]}>
        {renderRowChairs(topChairs)}
      </View>
      <View style={styles.tableMiddleRow}>
        {sideChairs > 0 && (
          <Chair size={chairSize} color={color} style={{ marginRight: chairGap }} />
        )}
        <View
          style={[
            styles.tableSurface,
            {
              width: tableW,
              height: tableH,
              backgroundColor: bgColor,
              borderColor: color,
              borderWidth: isSelected ? 2.5 : 1.8,
            },
          ]}
        >
          <View style={[styles.capacityBadge, { backgroundColor: color }]}>
            <Text style={styles.capacityText}>{table.capacity}</Text>
          </View>
          <Text style={[styles.tableLabel, { color }]} numberOfLines={1}>
            {table.label}
          </Text>
        </View>
        {sideChairs > 0 && (
          <Chair size={chairSize} color={color} style={{ marginLeft: chairGap }} />
        )}
      </View>
      <View style={[styles.chairRow, { marginTop: chairGap }]}>
        {renderRowChairs(bottomChairs)}
      </View>
      {isSelected && (
        <View style={[styles.selectedRing, { borderColor: Colors.primary }]} />
      )}
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EmptyCell — tappable to add a table
// ─────────────────────────────────────────────────────────────────────────────

const EmptyCell: React.FC<{ size: number; onPress: () => void; atMax: boolean }> = ({
  size,
  onPress,
  atMax,
}) => (
  <TouchableOpacity
    style={[styles.emptyCell, { width: size, height: size }]}
    onPress={onPress}
    activeOpacity={atMax ? 1 : 0.5}
  >
    <Ionicons
      name="add"
      size={size * 0.32}
      color={atMax ? 'rgba(155,135,110,0.15)' : 'rgba(155,135,110,0.45)'}
    />
  </TouchableOpacity>
);

// ─────────────────────────────────────────────────────────────────────────────
// Add Table Modal
// ─────────────────────────────────────────────────────────────────────────────

interface AddTableModalProps {
  visible: boolean;
  row: number;
  col: number;
  currentCount: number;
  onClose: () => void;
  onConfirm: (label: string, capacity: 2 | 4 | 6) => void;
  isLoading: boolean;
}

const AddTableModal: React.FC<AddTableModalProps> = ({
  visible,
  row,
  col,
  currentCount,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [label, setLabel] = useState(`T${currentCount + 1}`);
  const [capacity, setCapacity] = useState<2 | 4 | 6>(2);

  // Reset when modal opens
  React.useEffect(() => {
    if (visible) {
      setLabel(`T${currentCount + 1}`);
      setCapacity(2);
    }
  }, [visible, currentCount]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalKAV}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            {/* Handle bar */}
            <View style={styles.modalHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>ADD TABLE</Text>
                <Text style={styles.modalTitle}>Row {row + 1} · Col {col + 1}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color={Colors.textDarkSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalCounter}>
              {currentCount}/10 tables placed
            </Text>

            {/* Label input */}
            <View style={styles.modalField}>
              <Input
                label="Table Label"
                value={label}
                onChangeText={setLabel}
                placeholder="e.g. T1, Window, Bar"
                isDark
                autoFocus
              />
            </View>

            {/* Capacity picker */}
            <Text style={styles.modalCapLabel}>CAPACITY</Text>
            <View style={styles.modalCapRow}>
              {([2, 4, 6] as const).map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.capOption, capacity === n && styles.capOptionActive]}
                  onPress={() => setCapacity(n)}
                >
                  {/* Mini table diagram */}
                  <View style={[styles.capDiagram, capacity === n && styles.capDiagramActive]}>
                    {/* Top chair(s) */}
                    <View style={styles.capChairRowTop}>
                      {Array.from({ length: n === 6 ? 2 : 1 }, (_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.capChair,
                            { backgroundColor: capacity === n ? Colors.primary : Colors.textDarkMuted },
                          ]}
                        />
                      ))}
                    </View>
                    {/* Table rect */}
                    <View style={[styles.capTable, capacity === n && styles.capTableActive]} />
                    {/* Bottom chair(s) */}
                    <View style={styles.capChairRowBottom}>
                      {Array.from({ length: n === 6 ? 2 : 1 }, (_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.capChair,
                            { backgroundColor: capacity === n ? Colors.primary : Colors.textDarkMuted },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.capNum, capacity === n && styles.capNumActive]}>{n}</Text>
                  <Text style={[styles.capSeats, capacity === n && styles.capSeatsActive]}>seats</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Confirm button */}
            <View style={styles.modalFooter}>
              <Button
                label="Add Table"
                onPress={() => {
                  if (!label.trim()) {
                    Alert.alert('Required', 'Please enter a table label.');
                    return;
                  }
                  onConfirm(label.trim(), capacity);
                }}
                loading={isLoading}
                fullWidth
              />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Restaurant Setup View (new admin onboarding)
// ─────────────────────────────────────────────────────────────────────────────

const RestaurantSetupView: React.FC<{ onCreated: () => void }> = ({ onCreated }) => {
  const [createRestaurant, { isLoading }] = useCreateRestaurantMutation();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gridRows, setGridRows] = useState('4');
  const [gridCols, setGridCols] = useState('5');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Restaurant name is required';
    if (!address.trim()) errs.address = 'Address is required';
    const rows = parseInt(gridRows, 10);
    const cols = parseInt(gridCols, 10);
    if (isNaN(rows) || rows < 1 || rows > 10) errs.gridRows = 'Must be 1–10';
    if (isNaN(cols) || cols < 1 || cols > 10) errs.gridCols = 'Must be 1–10';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    try {
      await createRestaurant({
        name: name.trim(),
        address: address.trim(),
        gridRows: parseInt(gridRows, 10),
        gridCols: parseInt(gridCols, 10),
      }).unwrap();
      onCreated();
    } catch (err: any) {
      Alert.alert('Error', err?.data?.error?.message ?? 'Could not create restaurant.');
    }
  };

  const previewRows = Math.min(parseInt(gridRows, 10) || 0, 10);
  const previewCols = Math.min(parseInt(gridCols, 10) || 0, 10);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.setupContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.setupIconWrapper}>
          <Ionicons name="restaurant-outline" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.setupEyebrow}>WELCOME, ADMIN</Text>
        <Text style={styles.setupTitle}>Set up your{'\n'}restaurant</Text>
        <Text style={styles.setupDesc}>
          Configure your restaurant and floor plan grid. After setup, tap any empty cell in the grid to place a table.
        </Text>
        <View style={styles.setupForm}>
          <Input
            label="Restaurant Name"
            value={name}
            onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: '' })); }}
            placeholder="e.g. La Bella Vista"
            error={errors.name}
            isDark
          />
          <Input
            label="Address"
            value={address}
            onChangeText={(t) => { setAddress(t); setErrors((e) => ({ ...e, address: '' })); }}
            placeholder="e.g. 123 Main Street, New York"
            error={errors.address}
            isDark
          />
          <Text style={styles.gridSectionLabel}>FLOOR PLAN GRID SIZE</Text>
          <Text style={styles.gridSectionHint}>
            Each cell can hold one table. You can add up to 10 tables total after setup.
          </Text>
          <View style={styles.gridDimensionRow}>
            <View style={{ flex: 1 }}>
              <Input
                label="Rows"
                value={gridRows}
                onChangeText={(t) => { setGridRows(t); setErrors((e) => ({ ...e, gridRows: '' })); }}
                keyboardType="numeric"
                error={errors.gridRows}
                isDark
              />
            </View>
            <Text style={styles.gridXText}>×</Text>
            <View style={{ flex: 1 }}>
              <Input
                label="Columns"
                value={gridCols}
                onChangeText={(t) => { setGridCols(t); setErrors((e) => ({ ...e, gridCols: '' })); }}
                keyboardType="numeric"
                error={errors.gridCols}
                isDark
              />
            </View>
          </View>
          {previewRows > 0 && previewCols > 0 && (
            <View style={styles.gridPreviewWrapper}>
              <Text style={styles.gridPreviewTitle}>
                Preview — {previewRows}×{previewCols} ({previewRows * previewCols} cells, max 10 tables)
              </Text>
              <View style={styles.gridPreview}>
                {Array.from({ length: previewRows }, (_, r) => (
                  <View key={r} style={styles.gridPreviewRow}>
                    {Array.from({ length: previewCols }, (_, c) => (
                      <View key={c} style={styles.gridPreviewCell} />
                    ))}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
        <Button label="Create Restaurant" onPress={handleCreate} loading={isLoading} fullWidth />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main FloorPlanScreen
// ─────────────────────────────────────────────────────────────────────────────

export const FloorPlanScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const [date] = useState(formatToday());

  // Selection state
  const [selectedTable, setSelectedTable] = useState<FloorPlanTable | null>(null);

  // Add table modal state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addingCell, setAddingCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });

  // ── Queries & mutations ───────────────────────────────────────────────────
  const {
    data: restaurantData,
    isLoading: restaurantLoading,
    error: restaurantError,
    refetch: refetchRestaurant,
  } = useGetAdminRestaurantQuery();

  const noRestaurant =
    !restaurantData?.data ||
    (restaurantError && (restaurantError as any)?.data?.error?.code === 4001);

  const { data, isLoading, refetch } = useGetFloorPlanQuery(date, {
    skip: !!noRestaurant,
  });

  const [createTable, { isLoading: isCreating }] = useCreateTableMutation();
  const [updateTable, { isLoading: isUpdating }] = useUpdateTableMutation();
  const [deleteTable, { isLoading: isDeleting }] = useDeleteTableMutation();

  // ── Derived data ──────────────────────────────────────────────────────────
  const restaurant = data?.data?.restaurant ?? restaurantData?.data;
  const grid: (FloorPlanTable | null)[][] = data?.data?.grid ?? [];
  const gridCols = restaurant?.gridCols ?? 5;
  const gridRows = restaurant?.gridRows ?? 4;
  const cellSize = Math.floor((width - Spacing.xxl * 2 - 8) / gridCols);

  // Count placed tables (non-null cells)
  const currentTableCount = grid.flat().filter(Boolean).length;
  const atMaxTables = currentTableCount >= 10;

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleTablePress = (table: FloorPlanTable) => {
    setSelectedTable((prev) => (prev?.id === table.id ? null : table));
  };

  const handleEmptyCellPress = (row: number, col: number) => {
    if (atMaxTables) {
      Alert.alert(
        'Table Limit Reached',
        'A restaurant can have a maximum of 10 tables. Delete or deactivate an existing table first.',
      );
      return;
    }
    setSelectedTable(null); // close any open table panel
    setAddingCell({ row, col });
    setAddModalVisible(true);
  };

  const handleCreateTable = async (label: string, capacity: 2 | 4 | 6) => {
    if (!restaurant) return;
    try {
      await createTable({
        label,
        capacity,
        gridRow: addingCell.row,
        gridCol: addingCell.col,
      }).unwrap();
      setAddModalVisible(false);
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err?.data?.error?.message ?? 'Could not add table.');
    }
  };

  const handleToggleActive = async () => {
    if (!selectedTable) return;
    try {
      await updateTable({
        id: selectedTable.id,
        is_active: !selectedTable.is_active,
      }).unwrap();
      setSelectedTable(null);
      refetch();
    } catch {
      Alert.alert('Error', 'Could not update table.');
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

  // ── Loading ───────────────────────────────────────────────────────────────
  if (restaurantLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // ── New admin — restaurant setup ──────────────────────────────────────────
  if (noRestaurant) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
        <View style={styles.setupHeader}>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
            <Ionicons name="log-out-outline" size={22} color={Colors.textDarkMuted} />
          </TouchableOpacity>
        </View>
        <RestaurantSetupView onCreated={() => refetchRestaurant()} />
      </SafeAreaView>
    );
  }

  // ── Floor plan ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

      {/* Add table modal */}
      <AddTableModal
        visible={addModalVisible}
        row={addingCell.row}
        col={addingCell.col}
        currentCount={currentTableCount}
        onClose={() => setAddModalVisible(false)}
        onConfirm={handleCreateTable}
        isLoading={isCreating}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>FLOOR PLAN</Text>
            <Text style={styles.restaurantName} numberOfLines={1}>{restaurant?.name ?? '—'}</Text>
            <Text style={styles.restaurantMeta}>
              {gridRows}×{gridCols} grid · {currentTableCount}/10 tables
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
            <Ionicons name="log-out-outline" size={22} color={Colors.textDarkMuted} />
          </TouchableOpacity>
        </View>

        {/* Instruction banner */}
        <View style={styles.instructionBanner}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
          <Text style={styles.instructionText}>
            {atMaxTables
              ? 'Table limit reached (10/10). Delete a table to add more.'
              : 'Tap an empty cell ( + ) to add a table. Tap a table to manage it.'}
          </Text>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          {[
            { color: Colors.tableAvailable, label: 'Available' },
            { color: Colors.tableBooked, label: 'Booked' },
            { color: Colors.tableDisabled, label: 'Inactive' },
            { color: Colors.primary, label: 'Selected' },
          ].map(({ color, label }) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: color + '33', borderColor: color }]} />
              <Text style={styles.legendLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Capacity key */}
        <View style={styles.capacityKeyRow}>
          <Text style={styles.capacityKeyLabel}>Seats: </Text>
          {[2, 4, 6].map((n) => (
            <View key={n} style={styles.capacityKeyItem}>
              <View style={styles.capacityKeyBadge}>
                <Text style={styles.capacityKeyNum}>{n}</Text>
              </View>
              <Text style={styles.capacityKeyText}>{n}-seater</Text>
            </View>
          ))}
        </View>

        {/* Grid */}
        {isLoading ? (
          <ActivityIndicator color={Colors.primary} style={styles.loader} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.grid}>
              {Array.from({ length: gridRows }, (_, row) => (
                <View key={row} style={styles.gridRow}>
                  {Array.from({ length: gridCols }, (_, col) => {
                    const cell = grid[row]?.[col] ?? null;
                    if (cell) {
                      return (
                        <TableShape
                          key={col}
                          table={cell}
                          cellSize={cellSize}
                          isSelected={selectedTable?.id === cell.id}
                          onPress={handleTablePress}
                        />
                      );
                    }
                    return (
                      <EmptyCell
                        key={col}
                        size={cellSize}
                        atMax={atMaxTables}
                        onPress={() => handleEmptyCellPress(row, col)}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Selected table panel */}
        {selectedTable && (
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <View style={styles.panelTitleRow}>
                <View
                  style={[
                    styles.panelColorDot,
                    { backgroundColor: getStatusColor(selectedTable, false) },
                  ]}
                />
                <Text style={styles.panelTitle}>{selectedTable.label}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedTable(null)} style={styles.panelClose}>
                <Ionicons name="close" size={18} color={Colors.textDarkSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.panelDetails}>
              <View style={styles.panelDetailItem}>
                <Text style={styles.panelDetailLabel}>CAPACITY</Text>
                <Text style={styles.panelDetailValue}>{selectedTable.capacity} seats</Text>
              </View>
              <View style={styles.panelDetailDivider} />
              <View style={styles.panelDetailItem}>
                <Text style={styles.panelDetailLabel}>STATUS</Text>
                <Text style={styles.panelDetailValue}>
                  {!selectedTable.is_active ? 'Inactive' : selectedTable.status}
                </Text>
              </View>
              <View style={styles.panelDetailDivider} />
              <View style={styles.panelDetailItem}>
                <Text style={styles.panelDetailLabel}>POSITION</Text>
                <Text style={styles.panelDetailValue}>
                  R{selectedTable.gridRow + 1} · C{selectedTable.gridCol + 1}
                </Text>
              </View>
            </View>

            <View style={styles.panelActions}>
              <TouchableOpacity
                style={styles.panelBtn}
                onPress={handleToggleActive}
                disabled={isUpdating}
              >
                <Ionicons
                  name={selectedTable.is_active ? 'pause-circle-outline' : 'play-circle-outline'}
                  size={16}
                  color={Colors.primary}
                />
                <Text style={styles.panelBtnText}>
                  {selectedTable.is_active ? 'Deactivate' : 'Activate'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.panelBtn, styles.panelBtnDanger]}
                onPress={handleDelete}
                disabled={isDeleting}
              >
                <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                <Text style={[styles.panelBtnText, styles.panelBtnTextDanger]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};