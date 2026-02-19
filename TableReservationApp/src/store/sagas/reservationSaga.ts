import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { reservationApi } from '../../api/reservationApi';
import {
  fetchAvailabilityRequest,
  fetchAvailabilitySuccess,
  fetchAvailabilityFailure,
  fetchMyReservationsRequest,
  fetchMyReservationsSuccess,
  fetchMyReservationsFailure,
  fetchMyReservationByIdRequest,
  fetchMyReservationByIdSuccess,
  fetchMyReservationByIdFailure,
  createReservationRequest,
  createReservationSuccess,
  createReservationFailure,
  updateReservationRequest,
  updateReservationSuccess,
  updateReservationFailure,
  cancelReservationRequest,
  cancelReservationSuccess,
  cancelReservationFailure,
  fetchAdminReservationsRequest,
  fetchAdminReservationsSuccess,
  fetchAdminReservationsFailure,
  fetchAdminReservationByIdRequest,
  fetchAdminReservationByIdSuccess,
  fetchAdminReservationByIdFailure,
  adminCreateReservationRequest,
  adminCreateReservationSuccess,
  adminCreateReservationFailure,
  adminUpdateReservationRequest,
  adminUpdateReservationSuccess,
  adminUpdateReservationFailure,
  adminUpdateStatusRequest,
  adminUpdateStatusSuccess,
  adminUpdateStatusFailure,
  adminCancelReservationRequest,
  adminCancelReservationSuccess,
  adminCancelReservationFailure,
} from '../slices/reservationSlice';
import { parseApiError } from '../../utils/errorParser';
import Toast from 'react-native-toast-message';
import { Strings } from '../../constants/strings';

function* handleFetchAvailability(
  action: ReturnType<typeof fetchAvailabilityRequest>,
): Generator {
  try {
    const response = (yield call(reservationApi.getAvailability, action.payload)) as AxiosResponse<any>;
    yield put(fetchAvailabilitySuccess(response.data.data));
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(fetchAvailabilityFailure(message));
  }
}

function* handleFetchMyReservations(
  action: ReturnType<typeof fetchMyReservationsRequest>,
): Generator {
  try {
    const response = (yield call(reservationApi.getMyReservations, action.payload)) as AxiosResponse<any>;
    yield put(fetchMyReservationsSuccess(response.data.data));
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(fetchMyReservationsFailure(message));
  }
}

function* handleFetchMyReservationById(
  action: ReturnType<typeof fetchMyReservationByIdRequest>,
): Generator {
  try {
    const response = (yield call(reservationApi.getMyReservationById, action.payload)) as AxiosResponse<any>;
    yield put(fetchMyReservationByIdSuccess(response.data.data));
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(fetchMyReservationByIdFailure(message));
  }
}

function* handleCreateReservation(
  action: ReturnType<typeof createReservationRequest>,
): Generator {
  try {
    const response = (yield call(reservationApi.createReservation, action.payload)) as AxiosResponse<any>;
    yield put(createReservationSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Booked!', text2: Strings.successReservationCreated });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(createReservationFailure(message));
    Toast.show({ type: 'error', text1: 'Booking Failed', text2: message });
  }
}

function* handleUpdateReservation(
  action: ReturnType<typeof updateReservationRequest>,
): Generator {
  try {
    const response = (yield call(reservationApi.updateReservation, action.payload)) as AxiosResponse<any>;
    yield put(updateReservationSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Updated!', text2: Strings.successReservationUpdated });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(updateReservationFailure(message));
    Toast.show({ type: 'error', text1: 'Update Failed', text2: message });
  }
}

function* handleCancelReservation(
  action: ReturnType<typeof cancelReservationRequest>,
): Generator {
  try {
    yield call(reservationApi.cancelReservation, action.payload);
    yield put(cancelReservationSuccess(action.payload));
    Toast.show({ type: 'success', text1: 'Cancelled', text2: Strings.successReservationCancelled });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(cancelReservationFailure(message));
    Toast.show({ type: 'error', text1: 'Error', text2: message });
  }
}

function* handleFetchAdminReservations(
  action: ReturnType<typeof fetchAdminReservationsRequest>,
): Generator {
  try {
    const response = (yield call(reservationApi.getAdminReservations, action.payload)) as AxiosResponse<any>;
    yield put(fetchAdminReservationsSuccess(response.data.data));
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(fetchAdminReservationsFailure(message));
  }
}

function* handleFetchAdminReservationById(
  action: ReturnType<typeof fetchAdminReservationByIdRequest>,
): Generator {
  try {
    const response = (yield call(reservationApi.getAdminReservationById, action.payload)) as AxiosResponse<any>;
    yield put(fetchAdminReservationByIdSuccess(response.data.data));
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(fetchAdminReservationByIdFailure(message));
  }
}

function* handleAdminCreateReservation(
  action: ReturnType<typeof adminCreateReservationRequest>,
): Generator {
  try {
    const response = (yield call(reservationApi.adminCreateReservation, action.payload)) as AxiosResponse<any>;
    yield put(adminCreateReservationSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Created!', text2: Strings.successReservationCreated });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(adminCreateReservationFailure(message));
    Toast.show({ type: 'error', text1: 'Error', text2: message });
  }
}

function* handleAdminUpdateReservation(
  action: ReturnType<typeof adminUpdateReservationRequest>,
): Generator {
  try {
    const response = (yield call(reservationApi.adminUpdateReservation, action.payload)) as AxiosResponse<any>;
    yield put(adminUpdateReservationSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Updated!', text2: Strings.successReservationUpdated });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(adminUpdateReservationFailure(message));
    Toast.show({ type: 'error', text1: 'Error', text2: message });
  }
}

function* handleAdminUpdateStatus(
  action: ReturnType<typeof adminUpdateStatusRequest>,
): Generator {
  try {
    const response = (yield call(
      reservationApi.adminUpdateStatus,
      action.payload.id,
      action.payload.status,
    )) as AxiosResponse<any>;
    yield put(adminUpdateStatusSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Status Updated', text2: `Status changed to ${action.payload.status}` });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(adminUpdateStatusFailure(message));
    Toast.show({ type: 'error', text1: 'Error', text2: message });
  }
}

function* handleAdminCancelReservation(
  action: ReturnType<typeof adminCancelReservationRequest>,
): Generator {
  try {
    yield call(reservationApi.adminCancelReservation, action.payload);
    yield put(adminCancelReservationSuccess(action.payload));
    Toast.show({ type: 'success', text1: 'Cancelled', text2: Strings.successReservationCancelled });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(adminCancelReservationFailure(message));
    Toast.show({ type: 'error', text1: 'Error', text2: message });
  }
}

export function* reservationSaga() {
  yield takeLatest(fetchAvailabilityRequest.type, handleFetchAvailability);
  yield takeLatest(fetchMyReservationsRequest.type, handleFetchMyReservations);
  yield takeLatest(fetchMyReservationByIdRequest.type, handleFetchMyReservationById);
  yield takeLatest(createReservationRequest.type, handleCreateReservation);
  yield takeLatest(updateReservationRequest.type, handleUpdateReservation);
  yield takeLatest(cancelReservationRequest.type, handleCancelReservation);
  yield takeLatest(fetchAdminReservationsRequest.type, handleFetchAdminReservations);
  yield takeLatest(fetchAdminReservationByIdRequest.type, handleFetchAdminReservationById);
  yield takeLatest(adminCreateReservationRequest.type, handleAdminCreateReservation);
  yield takeLatest(adminUpdateReservationRequest.type, handleAdminUpdateReservation);
  yield takeLatest(adminUpdateStatusRequest.type, handleAdminUpdateStatus);
  yield takeLatest(adminCancelReservationRequest.type, handleAdminCancelReservation);
}
