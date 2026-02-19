import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { authApi } from '../../api/authApi';
import {
  loginRequest, loginSuccess, loginFailure,
  registerRequest, registerSuccess, registerFailure,
  logoutAction,
  clearError,
} from '../slices/authSlice';
import { storageUtils } from '../../utils/storage';
import { parseApiError } from '../../utils/errorParser';
import Toast from 'react-native-toast-message';

function* handleLogin(action: ReturnType<typeof loginRequest>): Generator {
  try {
    const response = (yield call(authApi.login, action.payload)) as AxiosResponse<any>;
    const { accessToken, refreshToken, user } = response.data.data;

    // Save to storage (best-effort — don't fail login if storage fails)
    try {
      yield call(storageUtils.saveAuthData, { accessToken, refreshToken, user });
    } catch (storageErr) {
      console.warn('Storage save failed (non-fatal):', storageErr);
    }

    yield put(loginSuccess({ user, accessToken, refreshToken }));
    Toast.show({ type: 'success', text1: `Welcome back, ${user.name}!` });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(loginFailure(message));
    Toast.show({ type: 'error', text1: 'Login Failed', text2: message });
  }
}

function* handleRegister(action: ReturnType<typeof registerRequest>): Generator {
  try {
    const response = (yield call(authApi.register, action.payload)) as AxiosResponse<any>;
    const { accessToken, refreshToken, user } = response.data.data;

    try {
      yield call(storageUtils.saveAuthData, { accessToken, refreshToken, user });
    } catch (storageErr) {
      console.warn('Storage save failed (non-fatal):', storageErr);
    }

    yield put(registerSuccess({ user, accessToken, refreshToken }));
    Toast.show({ type: 'success', text1: 'Welcome!', text2: `Account created for ${user.name}` });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(registerFailure(message));
    Toast.show({ type: 'error', text1: 'Registration Failed', text2: message });
  }
}

function* handleLogout(): Generator {
  try {
    console.log('🔴 LOGOUT SAGA STARTED');
    const { store } = require('../../store');
    const state = store.getState();
    const refreshToken = state.auth.refreshToken;
    console.log('🔴 Logout state:', { hasRefreshToken: !!refreshToken, user: state.auth.user?.email });
    
    // Call logout endpoint if we have a refresh token
    if (refreshToken) {
      try {
        console.log('🔴 Calling API logout endpoint...');
        yield call(authApi.logout, refreshToken);
        console.log('✅ API logout successful');
      } catch (error) {
        console.warn('⚠️  Logout API call failed (non-fatal):', error);
      }
    }
    
    // Clear local storage
    console.log('🔴 Clearing storage...');
    yield call(storageUtils.clearAuthData);
    console.log('✅ Storage cleared');
    
    // Dispatch logout to clear Redux state
    console.log('🔴 Dispatching logout reducer...');
    // NOTE: We don't need another logoutAction here - the saga was triggered BY that action
    // The reducer already ran, now we just need to clear storage via saga
    
    Toast.show({ type: 'success', text1: 'Signed out successfully' });
    console.log('✅ LOGOUT SAGA COMPLETED');
  } catch (error: any) {
    console.error('❌ Logout saga error:', error);
    // Still clear storage even if API call fails
    try {
      yield call(storageUtils.clearAuthData);
    } catch (_) {
      // ignore
    }
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
  yield takeLatest(logoutAction.type, handleLogout);
}
