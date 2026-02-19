import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { createRestaurantCardStyles } from './RestaurantCard.styles';
import { Colors } from '../../constants/colors';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => {
  const { colors } = useTheme();
  const styles = createRestaurantCardStyles(colors);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconContainer}>
        <Ionicons name="restaurant" size={28} color={Colors.white} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.address} numberOfLines={1}>{restaurant.address}</Text>
        </View>
        {restaurant.activeTableCount !== undefined && (
          <View style={styles.row}>
            <Ionicons name="grid-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.tableCount}>{restaurant.activeTableCount} tables available</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
};
