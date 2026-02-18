import React from 'react';
import { View, ViewStyle } from 'react-native';
import { styles } from './Card.styles';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  isDark?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, isDark = false }) => (
  <View style={[styles.card, isDark && styles.cardDark, style]}>
    {children}
  </View>
);