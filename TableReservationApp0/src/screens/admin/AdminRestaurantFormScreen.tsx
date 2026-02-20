import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../types';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  createRestaurantRequest,
  updateRestaurantRequest,
} from '../../store/slices/restaurantSlice';
import { useTheme } from '../../hooks/useTheme';
import { createFormStyles } from '../customer/NewReservationScreen.styles';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminRestaurantForm'>;
};

export const AdminRestaurantFormScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { adminRestaurant, isLoading } = useAppSelector((s) => s.restaurant);
  const styles = createFormStyles(colors);

  const isEditing = !!adminRestaurant;

  const [name, setName] = useState(adminRestaurant?.name ?? '');
  const [address, setAddress] = useState(adminRestaurant?.address ?? '');
  const [gridRows, setGridRows] = useState(adminRestaurant?.gridRows?.toString() ?? '5');
  const [gridCols, setGridCols] = useState(adminRestaurant?.gridCols?.toString() ?? '5');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Restaurant name is required';
    if (!address.trim()) e.address = 'Address is required';
    if (!gridRows || isNaN(Number(gridRows)) || Number(gridRows) < 1) e.gridRows = 'Enter valid rows (min 1)';
    if (!gridCols || isNaN(Number(gridCols)) || Number(gridCols) < 1) e.gridCols = 'Enter valid columns (min 1)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      name: name.trim(),
      address: address.trim(),
      grid_rows: Number(gridRows),
      grid_cols: Number(gridCols),
    };
    if (isEditing) {
      dispatch(updateRestaurantRequest(payload));
    } else {
      dispatch(createRestaurantRequest(payload));
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isEditing ? 'Edit Restaurant' : 'Create Restaurant'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppInput
            label="Restaurant Name"
            placeholder="e.g. La Bella Vista"
            value={name}
            onChangeText={setName}
            leftIcon="storefront-outline"
            error={errors.name}
          />
          <AppInput
            label="Address"
            placeholder="e.g. 123 Main St, City"
            value={address}
            onChangeText={setAddress}
            leftIcon="location-outline"
            error={errors.address}
          />
          <AppInput
            label="Floor Plan Rows"
            placeholder="e.g. 5"
            value={gridRows}
            onChangeText={setGridRows}
            keyboardType="numeric"
            leftIcon="resize-outline"
            error={errors.gridRows}
          />
          <AppInput
            label="Floor Plan Columns"
            placeholder="e.g. 5"
            value={gridCols}
            onChangeText={setGridCols}
            keyboardType="numeric"
            leftIcon="resize-outline"
            error={errors.gridCols}
          />

          <AppButton
            label={isEditing ? 'Save Changes' : 'Create Restaurant'}
            fullWidth
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
