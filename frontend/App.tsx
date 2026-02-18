import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './src/store';
import { setCredentials } from './src/store/slices/authSlice';
import { RootNavigator } from './src/navigation/RootNavigator';
import {
  useFonts,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { Colors } from './src/styles/colors';

// Separate inner component so it can use hooks inside the Provider
const AppInner: React.FC = () => {
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_700Bold_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  // Rehydrate auth state from AsyncStorage on launch
  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem('auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Only restore if all required fields exist
          if (parsed.user && parsed.accessToken && parsed.refreshToken) {
            dispatch(setCredentials(parsed));
          }
        }
      } catch {
        // Corrupted storage — just start fresh
      } finally {
        setIsHydrated(true);  // Always mark done, even on error
      }
    };
    hydrate();
  }, []);

  // Show spinner until both fonts are loaded AND auth is rehydrated
  if (!fontsLoaded || !isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgBase }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return <RootNavigator />;
};

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}