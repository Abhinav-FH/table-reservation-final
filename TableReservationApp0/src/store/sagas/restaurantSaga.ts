import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { restaurantApi } from '../../api/restaurantApi';
import {
  fetchRestaurantsRequest,
  fetchRestaurantsSuccess,
  fetchRestaurantsFailure,
  fetchRestaurantByIdRequest,
  fetchRestaurantByIdSuccess,
  fetchRestaurantByIdFailure,
  fetchAdminRestaurantRequest,
  fetchAdminRestaurantSuccess,
  fetchAdminRestaurantFailure,
  createRestaurantRequest,
  createRestaurantSuccess,
  createRestaurantFailure,
  updateRestaurantRequest,
  updateRestaurantSuccess,
  updateRestaurantFailure,
} from '../slices/restaurantSlice';
import { parseApiError } from '../../utils/errorParser';
import Toast from 'react-native-toast-message';
import { Strings } from '../../constants/strings';

function* handleFetchRestaurants(): Generator {
  try {
    const response = (yield call(restaurantApi.getAll)) as AxiosResponse<any>;
    yield put(fetchRestaurantsSuccess(response.data.data));
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(fetchRestaurantsFailure(message));
  }
}

function* handleFetchRestaurantById(
  action: ReturnType<typeof fetchRestaurantByIdRequest>,
): Generator {
  try {
    const response = (yield call(restaurantApi.getById, action.payload)) as AxiosResponse<any>;
    yield put(fetchRestaurantByIdSuccess(response.data.data));
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(fetchRestaurantByIdFailure(message));
  }
}

function* handleFetchAdminRestaurant(): Generator {
  try {
    const response = (yield call(restaurantApi.getAdminRestaurant)) as AxiosResponse<any>;
    yield put(fetchAdminRestaurantSuccess(response.data.data));
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(fetchAdminRestaurantFailure(message));
  }
}

function* handleCreateRestaurant(
  action: ReturnType<typeof createRestaurantRequest>,
): Generator {
  try {
    const response = (yield call(restaurantApi.createRestaurant, action.payload)) as AxiosResponse<any>;
    yield put(createRestaurantSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Success', text2: 'Restaurant created!' });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(createRestaurantFailure(message));
    Toast.show({ type: 'error', text1: 'Error', text2: message });
  }
}

function* handleUpdateRestaurant(
  action: ReturnType<typeof updateRestaurantRequest>,
): Generator {
  try {
    const response = (yield call(restaurantApi.updateRestaurant, action.payload)) as AxiosResponse<any>;
    yield put(updateRestaurantSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Success', text2: Strings.successRestaurantUpdated });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(updateRestaurantFailure(message));
    Toast.show({ type: 'error', text1: 'Error', text2: message });
  }
}

export function* restaurantSaga() {
  yield takeLatest(fetchRestaurantsRequest.type, handleFetchRestaurants);
  yield takeLatest(fetchRestaurantByIdRequest.type, handleFetchRestaurantById);
  yield takeLatest(fetchAdminRestaurantRequest.type, handleFetchAdminRestaurant);
  yield takeLatest(createRestaurantRequest.type, handleCreateRestaurant);
  yield takeLatest(updateRestaurantRequest.type, handleUpdateRestaurant);
}
