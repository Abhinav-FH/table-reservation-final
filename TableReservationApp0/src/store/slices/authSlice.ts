import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginPayload, RegisterPayload, UserRole } from '../../types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state, _action: PayloadAction<LoginPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>,
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    registerRequest: (state, _action: PayloadAction<RegisterPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>,
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    logoutAction: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    refreshTokenAction: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    clearError: (state) => {
      state.error = null;
    },

    hydrateAuth: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutAction,
  refreshTokenAction,
  clearError,
  hydrateAuth,
} = authSlice.actions;

export default authSlice.reducer;
