import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CustomerStackParamList, CustomerTabParamList } from '../types';
import { HomeScreen } from '../screens/customer/HomeScreen';
import { MyReservationsScreen } from '../screens/customer/MyReservationsScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { RestaurantDetailScreen } from '../screens/customer/RestaurantDetailScreen';
import { NewReservationScreen } from '../screens/customer/NewReservationScreen';
import { ReservationDetailScreen } from '../screens/customer/ReservationDetailScreen';
import { EditReservationScreen } from '../screens/customer/EditReservationScreen';
import { useTheme } from '../hooks/useTheme';
import { Colors } from '../constants/colors';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const Stack = createNativeStackNavigator<CustomerStackParamList>();

const CustomerTabs: React.FC = () => {
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
            HomeTab: focused ? 'home' : 'home-outline',
            ReservationsTab: focused ? 'calendar' : 'calendar-outline',
            ProfileTab: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="ReservationsTab" component={MyReservationsScreen} options={{ title: 'Reservations' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export const CustomerNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="NewReservation" component={NewReservationScreen} />
      <Stack.Screen name="ReservationDetail" component={ReservationDetailScreen} />
      <Stack.Screen name="EditReservation" component={EditReservationScreen} />
    </Stack.Navigator>
  );
};
