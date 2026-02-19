import { Platform } from 'react-native';

// expo-secure-store only works on native (iOS/Android), not web
// On web we fall back to localStorage
const isWeb = Platform.OS === 'web';

const KEYS = {
  accessToken: 'auth_access_token',
  refreshToken: 'auth_refresh_token',
  user: 'auth_user',
};

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    localStorage.setItem(key, value);
    return;
  }
  const SecureStore = await import('expo-secure-store');
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  const SecureStore = await import('expo-secure-store');
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    localStorage.removeItem(key);
    return;
  }
  const SecureStore = await import('expo-secure-store');
  await SecureStore.deleteItemAsync(key);
}

export const storageUtils = {
  async saveAuthData(data: { accessToken: string; refreshToken: string; user: object }) {
    await Promise.all([
      setItem(KEYS.accessToken, data.accessToken),
      setItem(KEYS.refreshToken, data.refreshToken),
      setItem(KEYS.user, JSON.stringify(data.user)),
    ]);
  },

  async getAuthData() {
    const [accessToken, refreshToken, userStr] = await Promise.all([
      getItem(KEYS.accessToken),
      getItem(KEYS.refreshToken),
      getItem(KEYS.user),
    ]);
    return {
      accessToken,
      refreshToken,
      user: userStr ? JSON.parse(userStr) : null,
    };
  },

  async clearAuthData() {
    await Promise.all([
      deleteItem(KEYS.accessToken),
      deleteItem(KEYS.refreshToken),
      deleteItem(KEYS.user),
    ]);
  },
};
