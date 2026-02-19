import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, SafeAreaView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../types';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { registerRequest, clearError } from '../../store/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';
import { createAuthStyles } from './AuthScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
  route: RouteProp<AuthStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const { role } = route.params;
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((s) => s.auth);
  const styles = createAuthStyles(colors);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { return () => { dispatch(clearError()); }; }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email format';
    if (role === 'customer' && !phone.trim()) e.phone = 'Phone is required';
    if (!password.trim()) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;
    dispatch(registerRequest({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
      role,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.roleTag}>
              <Ionicons
                name={role === 'admin' ? 'storefront-outline' : 'person-outline'}
                size={14}
                color={Colors.primary}
              />
              <Text style={styles.roleText}>{role === 'admin' ? 'Admin' : 'Customer'}</Text>
            </View>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join us and start reserving</Text>
          </View>

          <AppInput
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            leftIcon="person-outline"
            error={errors.name}
          />
          <AppInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={errors.email}
          />
          {role === 'customer' && (
            <AppInput
              label="Mobile Number"
              placeholder="+1 234 567 8900"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon="call-outline"
              error={errors.phone}
            />
          )}
          <AppInput
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            isPassword
            leftIcon="lock-closed-outline"
            error={errors.password}
          />

          <AppButton
            label="Create Account"
            fullWidth
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.submitBtn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login', { role })}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
