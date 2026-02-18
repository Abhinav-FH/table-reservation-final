import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';  // ADD THIS

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
      }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Persist to AsyncStorage (fire-and-forget, don't await in reducer)
      AsyncStorage.setItem('auth', JSON.stringify(action.payload)).catch(() => {});
    },

    updateTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Update stored tokens without losing user data
      AsyncStorage.getItem('auth').then((stored) => {
        if (stored) {
          const parsed = JSON.parse(stored);
          AsyncStorage.setItem('auth', JSON.stringify({
            ...parsed,
            accessToken: action.payload.accessToken,
            refreshToken: action.payload.refreshToken,
          })).catch(() => {});
        }
      }).catch(() => {});
    },

    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear persisted session
      AsyncStorage.removeItem('auth').catch(() => {});
    },
  },
});

export const { setCredentials, updateTokens, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;