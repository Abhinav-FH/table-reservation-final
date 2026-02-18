import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { FloorPlanTable } from '../../store/api/adminApi';
import { styles, getTableColor } from './TableCell.styles';

interface TableCellProps {
  table: FloorPlanTable | null;
  cellSize: number;
  isSelected?: boolean;
  isSelectable?: boolean;
  onPress?: (table: FloorPlanTable) => void;
}

// Chair position SVG-style icons rendered as tiny dots
const ChairDot: React.FC<{ position: 'top' | 'bottom' | 'left' | 'right' | 'tl' | 'tr' | 'bl' | 'br' }> = ({ position }) => (
  <View style={[styles.chairDot, styles[`chairDot_${position}`]]} />
);

const ChairLayout: React.FC<{ capacity: 2 | 4 | 6 }> = ({ capacity }) => {
  if (capacity === 2) {
    return (
      <>
        <ChairDot position="top" />
        <ChairDot position="bottom" />
      </>
    );
  }
  if (capacity === 4) {
    return (
      <>
        <ChairDot position="top" />
        <ChairDot position="bottom" />
        <ChairDot position="left" />
        <ChairDot position="right" />
      </>
    );
  }
  return (
    <>
      <ChairDot position="tl" />
      <ChairDot position="tr" />
      <ChairDot position="left" />
      <ChairDot position="right" />
      <ChairDot position="bl" />
      <ChairDot position="br" />
    </>
  );
};

export const TableCell: React.FC<TableCellProps> = ({
  table,
  cellSize,
  isSelected = false,
  isSelectable = false,
  onPress,
}) => {
  // Empty cell
  if (!table) {
    return (
      <View style={[styles.cell, styles.emptyCell, { width: cellSize, height: cellSize }]} />
    );
  }

  const color = isSelected ? '#C8762E' : getTableColor(table.status, table.is_active);
  const handlePress = () => {
    if (isSelectable && onPress && table.is_active) {
      onPress(table);
    }
  };

  const tableSize = Math.round(cellSize * 0.62);

  return (
    <TouchableOpacity
      style={[styles.cell, { width: cellSize, height: cellSize }]}
      onPress={handlePress}
      activeOpacity={isSelectable && table.is_active ? 0.7 : 1}
      disabled={!isSelectable || !table.is_active}
    >
      {/* Chair indicators */}
      <View style={[styles.tableIconWrapper, { width: tableSize, height: tableSize }]}>
        <ChairLayout capacity={table.capacity as 2 | 4 | 6} />

        {/* Table circle */}
        <View
          style={[
            styles.tableCircle,
            {
              width: tableSize * 0.56,
              height: tableSize * 0.56,
              borderRadius: (tableSize * 0.56) / 2,
              backgroundColor: color + '22',
              borderColor: color,
            },
          ]}
        />
      </View>

      {/* Label */}
      <Text style={[styles.tableLabel, { color }]} numberOfLines={1}>
        {table.label}
      </Text>

      {/* Selected ring */}
      {isSelected && <View style={[styles.selectedRing, { borderRadius: 8, borderColor: color }]} />}
    </TouchableOpacity>
  );
};