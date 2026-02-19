import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AdminStackParamList, AdminTabParamList } from '../types';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminReservationsScreen } from '../screens/admin/AdminReservationsScreen';
import { AdminTablesScreen } from '../screens/admin/AdminTablesScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { AdminReservationDetailScreen } from '../screens/admin/AdminReservationDetailScreen';
import { AdminTableFormScreen } from '../screens/admin/AdminTableFormScreen';
import { AdminFloorPlanScreen } from '../screens/admin/AdminFloorPlanScreen';
import { AdminNewReservationScreen } from '../screens/admin/AdminNewReservationScreen';
import { AdminEditReservationScreen } from '../screens/admin/AdminEditReservationScreen';
import { AdminRestaurantFormScreen } from '../screens/admin/AdminRestaurantFormScreen';
import { useTheme } from '../hooks/useTheme';
import { Colors } from '../constants/colors';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminTabs: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, string> = {
            DashboardTab: focused ? 'grid' : 'grid-outline',
            ReservationsTab: focused ? 'calendar' : 'calendar-outline',
            TablesTab: focused ? 'restaurant' : 'restaurant-outline',
            ProfileTab: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={AdminDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="ReservationsTab" component={AdminReservationsScreen} options={{ title: 'Reservations' }} />
      <Tab.Screen name="TablesTab" component={AdminTablesScreen} options={{ title: 'Tables' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export const AdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="AdminReservationDetail" component={AdminReservationDetailScreen} />
      <Stack.Screen name="AdminNewReservation" component={AdminNewReservationScreen} />
      <Stack.Screen name="AdminEditReservation" component={AdminEditReservationScreen} />
      <Stack.Screen name="AdminTableForm" component={AdminTableFormScreen} />
      <Stack.Screen name="AdminFloorPlan" component={AdminFloorPlanScreen} />
      <Stack.Screen name="AdminRestaurantForm" component={AdminRestaurantFormScreen} />
    </Stack.Navigator>
  );
};
