import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CustomerStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchRestaurantByIdRequest } from '../../store/slices/restaurantSlice';
import { AppButton } from '../../components/common/AppButton';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { useTheme } from '../../hooks/useTheme';
import { createRestaurantDetailStyles } from './RestaurantDetailScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'RestaurantDetail'>;
  route: RouteProp<CustomerStackParamList, 'RestaurantDetail'>;
};

export const RestaurantDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { restaurantId } = route.params;
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { selected, isLoading } = useAppSelector((s) => s.restaurant);
  const styles = createRestaurantDetailStyles(colors);

  useEffect(() => {
    dispatch(fetchRestaurantByIdRequest(restaurantId));
  }, [restaurantId]);

  if (isLoading || !selected) return <LoadingOverlay fullScreen />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Restaurant Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="restaurant" size={40} color={Colors.white} />
          </View>
          <Text style={styles.restaurantName}>{selected.name}</Text>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.address}>{selected.address}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="grid-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>Active Tables</Text>
            <Text style={styles.infoValue}>{selected.activeTableCount ?? '–'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="resize-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>Seating Layout</Text>
            <Text style={styles.infoValue}>{selected.grid_rows} × {selected.grid_cols}</Text>
          </View>
        </View>

        <AppButton
          label="Make a Reservation"
          fullWidth
          onPress={() => navigation.navigate('NewReservation', { restaurantId: selected.id })}
          style={styles.ctaBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
