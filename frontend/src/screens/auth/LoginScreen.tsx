import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from '../../navigation/AuthNavigator';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../hooks/useRedux';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { styles } from './LoginScreen.styles';
import { Colors } from '../../styles/colors';

type Props = NativeStackScreenProps<AuthStackParams, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const { role } = route.params;
  const isDark = role === 'admin';
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      const result = await login({ email, password, role }).unwrap();
      dispatch(setCredentials(result.data));
    } catch (err: any) {
      const msg = err?.data?.error?.message ?? 'Login failed. Please try again.';
      Alert.alert('Login Failed', msg);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={[styles.backText, isDark && styles.backTextDark]}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={[styles.eyebrow, isDark && styles.eyebrowDark]}>
            {role === 'admin' ? 'ADMIN LOGIN' : 'GUEST LOGIN'}
          </Text>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            Welcome back.
          </Text>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              error={errors.email}
              isDark={isDark}
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={errors.password}
              isDark={isDark}
            />
          </View>

          <Button label="Sign In" onPress={handleLogin} loading={isLoading} fullWidth />

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={[styles.registerHint, isDark && styles.registerHintDark]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register', { role })}>
              <Text style={styles.registerLink}>Create one</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};