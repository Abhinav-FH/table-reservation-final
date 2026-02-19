import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Switch, Modal } from 'react-native';
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    console.log('🔴 User confirmed logout in modal');
    setShowLogoutModal(false);
    console.log('🔴 Dispatching logoutAction now...');
    dispatch(logoutAction());
    console.log('🟢 logoutAction dispatched');
  };

  const handleLogout = () => {
    console.log('🔴 handleLogout clicked - showing confirmation modal');
    setShowLogoutModal(true);
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
            onValueChange={() => {
              dispatch(toggleTheme());
            }}
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

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            backgroundColor: colors.background, 
            borderRadius: 12, 
            padding: 20, 
            width: '80%',
            maxWidth: 300
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: colors.text }}>
              Sign Out
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20, color: colors.text }}>
              Are you sure you want to sign out?
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{ 
                  flex: 1, 
                  padding: 12, 
                  backgroundColor: colors.border, 
                  borderRadius: 8,
                  alignItems: 'center'
                }}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={{ color: colors.text, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ 
                  flex: 1, 
                  padding: 12, 
                  backgroundColor: Colors.error, 
                  borderRadius: 8,
                  alignItems: 'center'
                }}
                onPress={handleLogoutConfirm}
              >
                <Text style={{ color: Colors.white, fontWeight: '600' }}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
