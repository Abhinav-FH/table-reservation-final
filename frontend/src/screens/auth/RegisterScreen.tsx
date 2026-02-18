import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from '../../navigation/AuthNavigator';
import { useRegisterMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../hooks/useRedux';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { styles } from './LoginScreen.styles'; // reuse similar styles

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

  const handleRegister = async () => {
    try {
      const payload: any = { name, email, password, role };
      if (role === 'customer') payload.phone = phone;
      const result = await register(payload).unwrap();
      dispatch(setCredentials(result.data));
    } catch (err: any) {
      const msg = err?.data?.error?.message ?? 'Registration failed.';
      Alert.alert('Error', msg);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={[styles.backText, isDark && styles.backTextDark]}>← Back</Text>
          </TouchableOpacity>

          <Text style={[styles.eyebrow, isDark && styles.eyebrowDark]}>
            {role === 'admin' ? 'ADMIN ACCOUNT' : 'CREATE ACCOUNT'}
          </Text>
          <Text style={[styles.title, isDark && styles.titleDark]}>Join us today.</Text>

          <View style={styles.form}>
            <Input label="Full Name" value={name} onChangeText={setName} isDark={isDark} />
            <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" isDark={isDark} />
            {role === 'customer' && (
              <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" isDark={isDark} />
            )}
            <Input label="Password" value={password} onChangeText={setPassword} isPassword isDark={isDark} />
          </View>

          <Button label="Create Account" onPress={handleRegister} loading={isLoading} fullWidth />

          <View style={styles.registerRow}>
            <Text style={[styles.registerHint, isDark && styles.registerHintDark]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login', { role })}>
              <Text style={styles.registerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};