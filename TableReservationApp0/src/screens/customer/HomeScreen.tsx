import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, SafeAreaView, TextInput, RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchRestaurantsRequest } from '../../store/slices/restaurantSlice';
import { RestaurantCard } from '../../components/customer/RestaurantCard';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { EmptyState } from '../../components/common/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { createHomeScreenStyles } from './HomeScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerTabs'>;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { list, isLoading } = useAppSelector((s) => s.restaurant);
  const styles = createHomeScreenStyles(colors);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchRestaurantsRequest()); }, []);

  const filtered = list.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.address.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.heading}>Restaurants</Text>
        <Text style={styles.subheading}>Find and reserve your table</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={16} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {isLoading && list.length === 0 ? (
        <LoadingOverlay />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="restaurant-outline"
              title="No restaurants found"
              message={search ? 'Try a different search term.' : 'Check back later.'}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => dispatch(fetchRestaurantsRequest())}
              tintColor={Colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};
