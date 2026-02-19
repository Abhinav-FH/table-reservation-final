import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from '../../navigation/AuthNavigator';
import { useRegisterMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../hooks/useRedux';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { styles } from './RegisterSCreen.styles';

type Props = NativeStackScreenProps<AuthStackParams, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const { role } = route.params;
  const isDark = role === 'admin';
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address';
    if (role === 'customer') {
      if (!phone.trim()) errs.phone = 'Phone number is required';
      else if (phone.trim().length < 7) errs.phone = 'Enter a valid phone number';
    }
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      const payload: any = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      };
      // Phone is required for customer — always include it
      if (role === 'customer') {
        payload.phone = phone.trim();
      }
      const result = await register(payload).unwrap();
      dispatch(setCredentials(result.data));
    } catch (err: any) {
      const msg = err?.data?.error?.message ?? 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', msg);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={[styles.backText, isDark && styles.backTextDark]}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={[styles.eyebrow, isDark && styles.eyebrowDark]}>
            {role === 'admin' ? 'ADMIN ACCOUNT' : 'CREATE ACCOUNT'}
          </Text>
          <Text style={[styles.title, isDark && styles.titleDark]}>Join us today.</Text>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              value={name}
              onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }}
              autoComplete="name"
              error={errors.name}
              isDark={isDark}
            />
            <Input
              label="Email Address"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              error={errors.email}
              isDark={isDark}
            />

            {/* Phone — only for customers, always rendered (not conditional on render) */}
            {role === 'customer' && (
              <Input
                label="Phone Number"
                value={phone}
                onChangeText={(t) => { setPhone(t); setErrors((e) => ({ ...e, phone: undefined })); }}
                keyboardType="phone-pad"
                autoComplete="tel"
                placeholder="+1 234 567 8900"
                error={errors.phone}
                hint={!errors.phone ? 'Required for booking confirmations' : undefined}
                isDark={isDark}
              />
            )}

            <Input
              label="Password"
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
              isPassword
              error={errors.password}
              hint={!errors.password ? 'Minimum 6 characters' : undefined}
              isDark={isDark}
            />
          </View>

          <Button
            label="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
          />

          <View style={styles.registerRow}>
            <Text style={[styles.registerHint, isDark && styles.registerHintDark]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login', { role })}>
              <Text style={styles.registerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};