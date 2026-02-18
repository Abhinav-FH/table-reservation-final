import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { FloorPlanTable } from '../../store/api/adminApi';
import { TableCell } from './TableCell';
import { styles } from './FloorPlanGrid.styles';
import { Spacing } from '../../styles/spacing';

interface FloorPlanGridProps {
  grid: (FloorPlanTable | null)[][];
  gridRows: number;
  gridCols: number;
  selectedTableIds?: string[];
  onTablePress?: (table: FloorPlanTable) => void;
  isSelectable?: boolean;
}

export const FloorPlanGrid: React.FC<FloorPlanGridProps> = ({
  grid,
  gridRows,
  gridCols,
  selectedTableIds = [],
  onTablePress,
  isSelectable = false,
}) => {
  const { width } = useWindowDimensions();
  // Calculate cell size: total width minus padding divided by cols
  const availableWidth = width - Spacing.xxl * 2;
  const cellSize = Math.floor(availableWidth / gridCols);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {Array.from({ length: gridRows }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {Array.from({ length: gridCols }, (_, colIndex) => {
                const cell = grid[rowIndex]?.[colIndex] ?? null;
                const isSelected = cell ? selectedTableIds.includes(cell.id) : false;
                return (
                  <TableCell
                    key={`${rowIndex}-${colIndex}`}
                    table={cell}
                    cellSize={cellSize}
                    isSelected={isSelected}
                    isSelectable={isSelectable}
                    onPress={onTablePress}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};