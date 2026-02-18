import React from 'react';
import {
  View, Text, TouchableOpacity, StatusBar, SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from '../../navigation/AuthNavigator';
import { styles } from './RoleSelectScreen.styles';

type Props = NativeStackScreenProps<AuthStackParams, 'RoleSelect'>;

export const RoleSelectScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <View style={styles.container}>
        {/* Hero headline */}
        <View style={styles.heroSection}>
          <Text style={styles.eyebrow}>WELCOME</Text>
          <Text style={styles.headline}>Reserve your{'\n'}perfect table.</Text>
          <Text style={styles.subline}>
            Discover fine dining experiences and book your table in seconds.
          </Text>
        </View>

        {/* Role cards */}
        <View style={styles.cardsSection}>
          {/* Customer card */}
          <TouchableOpacity
            style={[styles.roleCard, styles.customerCard]}
            onPress={() => navigation.navigate('Login', { role: 'customer' })}
            activeOpacity={0.85}
          >
            <Text style={styles.roleIcon}>🍽️</Text>
            <View style={styles.roleTextGroup}>
              <Text style={styles.roleTitle}>I'm a Guest</Text>
              <Text style={styles.roleDesc}>Browse restaurants & make reservations</Text>
            </View>
            <Text style={styles.roleArrow}>→</Text>
          </TouchableOpacity>

          {/* Admin card */}
          <TouchableOpacity
            style={[styles.roleCard, styles.adminCard]}
            onPress={() => navigation.navigate('Login', { role: 'admin' })}
            activeOpacity={0.85}
          >
            <Text style={styles.roleIcon}>🏛️</Text>
            <View style={styles.roleTextGroup}>
              <Text style={[styles.roleTitle, styles.roleTitleDark]}>I'm a Restaurant</Text>
              <Text style={[styles.roleDesc, styles.roleDescDark]}>Manage tables & reservations</Text>
            </View>
            <Text style={[styles.roleArrow, styles.roleArrowDark]}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};