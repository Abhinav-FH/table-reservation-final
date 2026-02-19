import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { hydrateAuth } from '../store/slices/authSlice';
import { storageUtils } from '../utils/storage';
import { AuthNavigator } from './AuthNavigator';
import { CustomerNavigator } from './CustomerNavigator';
import { AdminNavigator } from './AdminNavigator';
import { Colors } from '../constants/colors';

export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const data = await storageUtils.getAuthData();
        if (data.accessToken && data.refreshToken && data.user) {
          dispatch(hydrateAuth({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user as any,
          }));
        }
      } catch (e) {
        // No stored session, proceed to auth
      } finally {
        setIsRestoring(false);
      }
    };
    restore();
  }, []);

  if (isRestoring) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated && <AuthNavigator />}
      {isAuthenticated && user?.role === 'customer' && <CustomerNavigator />}
      {isAuthenticated && user?.role === 'admin' && <AdminNavigator />}
    </NavigationContainer>
  );
};
