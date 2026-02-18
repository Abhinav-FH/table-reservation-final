import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../hooks/useRedux';
import { useTokenRefresh } from '../hooks/useTokenRefresh';  // ADD THIS
import { AuthNavigator } from './AuthNavigator';
import { CustomerNavigator } from './CustomerNavigator';
import { AdminNavigator } from './AdminNavigator';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  useTokenRefresh();  // ADD THIS — runs silently in background

  return (
    <NavigationContainer>
      {!isAuthenticated
        ? <AuthNavigator />
        : user?.role === 'admin'
          ? <AdminNavigator />
          : <CustomerNavigator />
      }
    </NavigationContainer>
  );
};