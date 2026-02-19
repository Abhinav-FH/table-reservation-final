import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { logoutAction } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { useTheme } from '../../hooks/useTheme';
import { createProfileStyles } from './ProfileScreen.styles';
import { Colors } from '../../constants/colors';

export const ProfileScreen: React.FC = () => {
  const { colors, mode } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const styles = createProfileStyles(colors);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => dispatch(logoutAction()),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() ?? '?'}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Ionicons
            name={user?.role === 'admin' ? 'storefront-outline' : 'person-outline'}
            size={12}
            color={Colors.primary}
          />
          <Text style={styles.roleText}>{user?.role}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Ionicons name={mode === 'dark' ? 'moon' : 'sunny-outline'} size={20} color={colors.icon} />
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={mode === 'dark'}
            onValueChange={() => dispatch(toggleTheme())}
            trackColor={{ false: colors.border, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
