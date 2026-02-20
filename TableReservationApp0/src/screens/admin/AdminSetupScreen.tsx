import React, { useEffect, useState } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchAdminRestaurantRequest, createRestaurantRequest } from '../../store/slices/restaurantSlice';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminSetup'>;
};

export const AdminSetupScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { adminRestaurant, isLoading } = useAppSelector((s) => s.restaurant);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checking, setChecking] = useState(true);

  // Check if restaurant already exists – if so, go straight to tabs
  useEffect(() => {
    dispatch(fetchAdminRestaurantRequest());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) return;

    if (adminRestaurant) {
      navigation.replace('AdminTabs');
    } else {
      setChecking(false);
    }
  }, [adminRestaurant, isLoading, navigation]);

  if (checking || isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Restaurant name is required';
    if (!address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    dispatch(createRestaurantRequest({
      name: name.trim(),
      address: address.trim(),
      gridRows: 5,
      gridCols: 5,
    }));
  };

  // // Navigate after restaurant created
  // useEffect(() => {
  //   if (adminRestaurant && !checking) {
  //     navigation.replace('AdminTabs');
  //   }
  // }, [adminRestaurant]);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
    icon: {
      width: 80, height: 80, borderRadius: 40,
      backgroundColor: Colors.primary,
      justifyContent: 'center', alignItems: 'center',
      alignSelf: 'center', marginBottom: Spacing.lg,
      shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35, shadowRadius: 16, elevation: 12,
    },
    title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: colors.text, textAlign: 'center', marginBottom: Spacing.xs },
    subtitle: { fontSize: FontSize.sm, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
    badge: {
      flexDirection: 'row', alignItems: 'center', alignSelf: 'center',
      backgroundColor: Colors.infoLight, borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md, paddingVertical: 6, marginBottom: Spacing.xl,
    },
    badgeText: { fontSize: FontSize.xs, color: Colors.info, fontWeight: FontWeight.semibold, marginLeft: 4 },
    hint: {
      flexDirection: 'row', gap: 8, backgroundColor: colors.surfaceSecondary,
      borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.sm, marginBottom: Spacing.md,
    },
    hintText: { fontSize: FontSize.xs, color: colors.textSecondary, flex: 1, lineHeight: 18 },
  });

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.icon}>
            <Ionicons name="storefront-outline" size={40} color={Colors.white} />
          </View>
          <Text style={s.title}>Set Up Your Restaurant</Text>
          <Text style={s.subtitle}>
            Before you start managing reservations, tell us a bit about your restaurant.
          </Text>

          <View style={s.badge}>
            <Ionicons name="shield-checkmark-outline" size={13} color={Colors.info} />
            <Text style={s.badgeText}>Step 1 of 1 — Takes less than a minute</Text>
          </View>

          <AppInput
            label="Restaurant Name"
            placeholder='e.g. "La Bella Vista"'
            value={name}
            onChangeText={setName}
            leftIcon="storefront-outline"
            error={errors.name}
          />
          <AppInput
            label="Address"
            placeholder='e.g. "123 Main Street, New York"'
            value={address}
            onChangeText={setAddress}
            leftIcon="location-outline"
            error={errors.address}
          />

          <View style={s.hint}>
            <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
            <Text style={s.hintText}>
              You can update these details later from your dashboard settings.
            </Text>
          </View>

          <AppButton
            label="Create Restaurant & Continue"
            fullWidth
            onPress={handleCreate}
            isLoading={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};