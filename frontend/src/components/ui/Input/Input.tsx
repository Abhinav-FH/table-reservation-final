import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Input.styles';
import { Colors } from '../../../styles/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  isPassword?: boolean;
  isDark?: boolean; // admin dark theme
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  isPassword,
  isDark = false,
  style,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>
      )}
      <View style={[styles.inputRow, isDark && styles.inputRowDark, error ? styles.inputRowError : null]}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark, style]}
          placeholderTextColor={isDark ? Colors.textDarkMuted : Colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword((p) => !p)} style={styles.eyeBtn}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={isDark ? Colors.textDarkMuted : Colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {(error || hint) && (
        <Text style={[styles.hint, error ? styles.hintError : null]}>{error ?? hint}</Text>
      )}
    </View>
  );
};