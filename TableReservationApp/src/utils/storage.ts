import * as SecureStore from 'expo-secure-store';

const KEYS = {
  accessToken: 'auth_access_token',
  refreshToken: 'auth_refresh_token',
  user: 'auth_user',
};

export const storageUtils = {
  async saveAuthData(data: { accessToken: string; refreshToken: string; user: object }) {
    await SecureStore.setItemAsync(KEYS.accessToken, data.accessToken);
    await SecureStore.setItemAsync(KEYS.refreshToken, data.refreshToken);
    await SecureStore.setItemAsync(KEYS.user, JSON.stringify(data.user));
  },

  async getAuthData() {
    const [accessToken, refreshToken, userStr] = await Promise.all([
      SecureStore.getItemAsync(KEYS.accessToken),
      SecureStore.getItemAsync(KEYS.refreshToken),
      SecureStore.getItemAsync(KEYS.user),
    ]);
    return {
      accessToken,
      refreshToken,
      user: userStr ? JSON.parse(userStr) : null,
    };
  },

  async clearAuthData() {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.accessToken),
      SecureStore.deleteItemAsync(KEYS.refreshToken),
      SecureStore.deleteItemAsync(KEYS.user),
    ]);
  },
};
