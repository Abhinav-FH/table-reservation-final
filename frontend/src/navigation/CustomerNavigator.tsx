import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/customer/HomeScreen';
import { CreateReservationScreen } from '../screens/customer/CreateReservationScreen';
import { MyReservationsScreen } from '../screens/customer/MyReservationsScreen';
import { Colors } from '../styles/colors';
import { Fonts } from '../styles/typography';
import { Ionicons } from '@expo/vector-icons';

// Explore stack (Home → CreateReservation)
export type ExploreStackParams = {
  Home: undefined;
  CreateReservation: { restaurantId: string; restaurantName: string };
};

const ExploreStack = createStackNavigator<ExploreStackParams>();

const ExploreNavigator: React.FC = () => (
  <ExploreStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: Colors.bgBase, elevation: 0, shadowOpacity: 0 },
      headerTitleStyle: { fontFamily: Fonts.display, color: Colors.textPrimary, fontSize: 20 },
      headerTintColor: Colors.primary,
    //   headerBackTitleVisible: false,
    }}
  >
    <ExploreStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <ExploreStack.Screen
      name="CreateReservation"
      component={CreateReservationScreen}
      options={({ route }) => ({ title: route.params.restaurantName })}
    />
  </ExploreStack.Navigator>
);

const Tab = createBottomTabNavigator();

export const CustomerNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: Colors.bgCard,
        borderTopColor: Colors.border,
        borderTopWidth: 1,
        paddingTop: 4,
        height: 60,
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarLabelStyle: { fontFamily: Fonts.sansMedium, fontSize: 11, marginBottom: 4 },
      tabBarIcon: ({ focused, color, size }) => {
        const icons: Record<string, keyof typeof Ionicons['glyphMap']> = {
          Explore: focused ? 'compass' : 'compass-outline',
          'My Bookings': focused ? 'calendar' : 'calendar-outline',
        };
        return <Ionicons name={icons[route.name] ?? 'circle'} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Explore" component={ExploreNavigator} />
    <Tab.Screen name="My Bookings" component={MyReservationsScreen} />
  </Tab.Navigator>
);