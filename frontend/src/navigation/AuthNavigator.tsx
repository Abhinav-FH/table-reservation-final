import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RoleSelectScreen } from '../screens/auth/RoleSelectScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

export type AuthStackParams = {
  RoleSelect: undefined;
  Login: { role: 'customer' | 'admin' };
  Register: { role: 'customer' | 'admin' };
};

const Stack = createStackNavigator<AuthStackParams>();

export const AuthNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);
