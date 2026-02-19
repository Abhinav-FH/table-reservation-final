import React from 'react';
import { View, Text, Image, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { AppButton } from '../../components/common/AppButton';
import { useTheme } from '../../hooks/useTheme';
import { createWelcomeStyles } from './WelcomeScreen.styles';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = createWelcomeStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Ionicons name="restaurant" size={56} color={Colors.white} />
        </View>
        <Text style={styles.appName}>TableBook</Text>
        <Text style={styles.tagline}>Reserve your perfect dining experience</Text>
      </View>

      <View style={styles.actions}>
        <Text style={styles.prompt}>Continue as</Text>
        <AppButton
          label="Customer"
          fullWidth
          onPress={() => navigation.navigate('Login', { role: 'customer' })}
          leftIcon={<Ionicons name="person-outline" size={18} color={Colors.white} />}
        />
        <View style={styles.spacer} />
        <AppButton
          label="Restaurant Admin"
          variant="outline"
          fullWidth
          onPress={() => navigation.navigate('Login', { role: 'admin' })}
          leftIcon={<Ionicons name="storefront-outline" size={18} color={Colors.primary} />}
        />
      </View>
    </SafeAreaView>
  );
};
