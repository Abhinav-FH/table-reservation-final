import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { authApi } from '../../api/authApi';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutAction,
} from '../slices/authSlice';
import { storageUtils } from '../../utils/storage';
import { parseApiError } from '../../utils/errorParser';
import Toast from 'react-native-toast-message';
import { Strings } from '../../constants/strings';

function* handleLogin(action: ReturnType<typeof loginRequest>): Generator {
  try {
    const response = (yield call(authApi.login, action.payload)) as AxiosResponse<any>;
    const { accessToken, refreshToken, user } = response.data.data;
    yield call(storageUtils.saveAuthData, { accessToken, refreshToken, user });
    yield put(loginSuccess({ user, accessToken, refreshToken }));
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
    yield call(storageUtils.saveAuthData, { accessToken, refreshToken, user });
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
    yield call(storageUtils.clearAuthData);
  } catch (_) {
    // swallow
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
  yield takeLatest(logoutAction.type, handleLogout);
}
