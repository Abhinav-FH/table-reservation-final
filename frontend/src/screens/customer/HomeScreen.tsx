import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  SafeAreaView, StatusBar, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useListRestaurantsQuery } from '../../store/api/customerApi';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { logout } from '../../store/slices/authSlice';
import { ExploreStackParams } from '../../navigation/CustomerNavigator';
import { styles } from './HomeScreen.styles';
import { Colors } from '../../styles/colors';
import { Card } from '../../components/ui/Card/Card';

type NavProp = StackNavigationProp<ExploreStackParams, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { data, isLoading, refetch } = useListRestaurantsQuery();

  const restaurants = data?.data ?? [];
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgBase} />
      <FlatList
        data={restaurants}
        keyExtractor={(r) => r.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Greeting */}
            <View style={styles.greetingRow}>
              <View>
                <Text style={styles.greeting}>Good evening,</Text>
                <Text style={styles.userName}>{firstName}</Text>
              </View>
              <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
                <Ionicons name="log-out-outline" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>RESTAURANTS NEAR YOU</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateReservation', {
              restaurantId: item.id,
              restaurantName: item.name,
            })}
            activeOpacity={0.8}
          >
            <Card style={styles.restaurantCard}>
              {/* Restaurant header */}
              <View style={styles.restaurantTop}>
                <View style={styles.restaurantAvatar}>
                  <Text style={styles.restaurantAvatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{item.name}</Text>
                  <Text style={styles.restaurantAddress} numberOfLines={1}>
                    {item.address}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </View>

              {/* Stats */}
              <View style={styles.restaurantStats}>
                <View style={styles.statChip}>
                  <Ionicons name="grid-outline" size={12} color={Colors.primary} />
                  <Text style={styles.statText}>{item.activeTableCount ?? '—'} tables</Text>
                </View>
                <View style={styles.statChip}>
                  <Ionicons name="calendar-outline" size={12} color={Colors.primary} />
                  <Text style={styles.statText}>Book now</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={styles.loader} color={Colors.primary} />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyText}>No restaurants available yet.</Text>
            </View>
          )
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};