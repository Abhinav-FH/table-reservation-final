


//////////////////////////////////////////////////////

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FloorPlanScreen } from '../screens/admin/FloorPlanScreen';
import { AdminReservationsScreen } from '../screens/admin/AdminReservationsScreen';
import { AdminCreateReservationScreen } from '../screens/admin/AdminCreateReservationScreen';
import { Colors } from '../styles/colors';
import { Fonts } from '../styles/typography';
import { Ionicons } from '@expo/vector-icons';

export type AdminReservationsStackParams = {
  AdminReservations: undefined;
  AdminCreateReservation: undefined;
};

const ResStack = createStackNavigator<AdminReservationsStackParams>();

export const AdminReservationsNavigator: React.FC = () => (
  <ResStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: Colors.bgDark, elevation: 0, shadowOpacity: 0 },
      headerTitleStyle: { fontFamily: Fonts.display, color: Colors.textDarkPrimary, fontSize: 20 },
      headerTintColor: Colors.primary,
    //   headerBackTitleVisible: false,
    }}
  >
    <ResStack.Screen name="AdminReservations" component={AdminReservationsScreen} options={{ headerShown: false }} />
    <ResStack.Screen
      name="AdminCreateReservation"
      component={AdminCreateReservationScreen}
      options={{ title: 'New Reservation' }}
    />
  </ResStack.Navigator>
);

const Tab = createBottomTabNavigator();

export const AdminNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: Colors.bgDarkCard,
        borderTopColor: Colors.borderDark,
        borderTopWidth: 1,
        paddingTop: 4,
        height: 60,
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textDarkMuted,
      tabBarLabelStyle: { fontFamily: Fonts.sansMedium, fontSize: 11, marginBottom: 4 },
      tabBarIcon: ({ focused, color, size }) => {
        const icons: Record<string, keyof typeof Ionicons['glyphMap']> = {
          'Floor Plan': focused ? 'grid' : 'grid-outline',
          Reservations: focused ? 'list' : 'list-outline',
        };
        return <Ionicons name={icons[route.name] ?? 'circle'} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Floor Plan" component={FloorPlanScreen} />
    <Tab.Screen name="Reservations" component={AdminReservationsNavigator} />
  </Tab.Navigator>
);