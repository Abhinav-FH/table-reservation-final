import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { reservationApi } from '../../api/reservationApi';
import { authApi } from '../../api/authApi';
import { parseApiError } from '../../utils/errorParser';
import Toast from 'react-native-toast-message';
import {
  fetchMyReservationsRequest, fetchMyReservationsSuccess, fetchMyReservationsFailure,
  fetchMyReservationByIdRequest, fetchMyReservationByIdSuccess, fetchMyReservationByIdFailure,
  fetchAvailabilityRequest, fetchAvailabilitySuccess, fetchAvailabilityFailure,
  createReservationRequest, createReservationSuccess, createReservationFailure,
  updateReservationRequest, updateReservationSuccess, updateReservationFailure,
  cancelReservationRequest, cancelReservationSuccess, cancelReservationFailure,
  fetchAdminReservationsRequest, fetchAdminReservationsSuccess, fetchAdminReservationsFailure,
  fetchAdminReservationByIdRequest, fetchAdminReservationByIdSuccess, fetchAdminReservationByIdFailure,
  adminCreateReservationRequest, adminCreateReservationSuccess, adminCreateReservationFailure,
  adminUpdateReservationRequest, adminUpdateReservationSuccess, adminUpdateReservationFailure,
  adminUpdateStatusRequest, adminUpdateStatusSuccess, adminUpdateStatusFailure,
  adminCancelReservationRequest, adminCancelReservationSuccess, adminCancelReservationFailure,
} from '../slices/reservationSlice';

// ─── Payload Helpers ───────────────────────────────────────────────────────────
// Backend schema is camelCase. Frontend types are camelCase too (per types/index.ts).
// We still normalise here to handle any legacy snake_case dispatches safely.

function ensureHHMM(t: string): string {
  // Ensures time is always "HH:MM" (e.g. "07:30:00" → "07:30", "7:30" → "07:30")
  if (!t) return '';
  const parts = t.split(':');
  const hh = parts[0].padStart(2, '0');
  const mm = (parts[1] ?? '00').padStart(2, '0');
  return `${hh}:${mm}`;
}

function toCreatePayload(p: any) {
  const raw = p.startTime ?? p.start_time ?? '';
  return {
    restaurantId: String(p.restaurantId ?? p.restaurant_id ?? ''),
    reservationDate: p.reservationDate ?? p.reservation_date ?? '',
    startTime: ensureHHMM(raw),
    guestCount: Number(p.guestCount ?? p.guest_count ?? 0),
    ...(p.specialRequests || p.special_requests
      ? { specialRequests: p.specialRequests ?? p.special_requests }
      : {}),
  };
}

function toUpdatePayload(p: any) {
  const out: any = {};
  const date = p.reservationDate ?? p.reservation_date;
  const time = p.startTime ?? p.start_time;
  const guests = p.guestCount ?? p.guest_count;
  const special = p.specialRequests ?? p.special_requests;
  if (date) out.reservationDate = date;
  if (time) out.startTime = ensureHHMM(time);
  if (guests != null) out.guestCount = Number(guests);
  if (special != null) out.specialRequests = special;
  return out;
}

function toAdminCreatePayload(p: any) {
  const raw = p.startTime ?? p.start_time ?? '';
  return {
    customerId: String(p.customerId ?? p.customer_id ?? ''),
    restaurantId: String(p.restaurantId ?? p.restaurant_id ?? ''),
    reservationDate: p.reservationDate ?? p.reservation_date ?? '',
    startTime: ensureHHMM(raw),
    guestCount: Number(p.guestCount ?? p.guest_count ?? 0),
    tableIds: ((p.tableIds ?? p.table_ids) ?? []).map(String),
    ...(p.specialRequests || p.special_requests
      ? { specialRequests: p.specialRequests ?? p.special_requests }
      : {}),
  };
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

function* handleFetchMyReservations(action: ReturnType<typeof fetchMyReservationsRequest>): Generator {
  try {
    const response = (yield call([reservationApi, reservationApi.getMyReservations], action.payload)) as AxiosResponse<any>;
    yield put(fetchMyReservationsSuccess(response.data.data ?? []));
  } catch (error: any) {
    yield put(fetchMyReservationsFailure(parseApiError(error)));
  }
}

function* handleFetchMyReservationById(action: ReturnType<typeof fetchMyReservationByIdRequest>): Generator {
  try {
    const response = (yield call([reservationApi, reservationApi.getMyReservationById], action.payload)) as AxiosResponse<any>;
    yield put(fetchMyReservationByIdSuccess(response.data.data));
  } catch (error: any) {
    yield put(fetchMyReservationByIdFailure(parseApiError(error)));
  }
}

function* handleFetchAvailability(action: ReturnType<typeof fetchAvailabilityRequest>): Generator {
  try {
    const response = (yield call([reservationApi, reservationApi.getAvailability], action.payload)) as AxiosResponse<any>;
    const transformed = (response.data.data ?? []).map((s: any) => ({
      ...s,
      start_time: s.time ?? s.start_time ?? '',
      end_time: s.time ?? s.end_time ?? '',
      available_tables: s.tableCount ?? s.available_tables ?? 0,
    }));
    yield put(fetchAvailabilitySuccess(transformed));
  } catch (error: any) {
    yield put(fetchAvailabilityFailure(parseApiError(error)));
  }
}

function* handleCreateReservation(action: ReturnType<typeof createReservationRequest>): Generator {
  try {
    const payload = toCreatePayload(action.payload);
    console.log('📤 createReservation →', JSON.stringify(payload));
    const response = (yield call([reservationApi, reservationApi.createReservation], payload)) as AxiosResponse<any>;
    yield put(createReservationSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Reservation Confirmed!', text2: 'Your table is booked.' });
  } catch (error: any) {
    const msg = parseApiError(error);
    yield put(createReservationFailure(msg));
    Toast.show({ type: 'error', text1: 'Booking Failed', text2: msg });
  }
}

function* handleUpdateReservation(action: ReturnType<typeof updateReservationRequest>): Generator {
  try {
    const { id, ...rest } = action.payload as any;
    const payload = { id, ...toUpdatePayload(rest) };
    const response = (yield call([reservationApi, reservationApi.updateReservation], payload)) as AxiosResponse<any>;
    yield put(updateReservationSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Reservation Updated!' });
  } catch (error: any) {
    const msg = parseApiError(error);
    yield put(updateReservationFailure(msg));
    Toast.show({ type: 'error', text1: 'Update Failed', text2: msg });
  }
}

function* handleCancelReservation(action: ReturnType<typeof cancelReservationRequest>): Generator {
  try {
    yield call([reservationApi, reservationApi.cancelReservation], action.payload);
    yield put(cancelReservationSuccess(action.payload));
    Toast.show({ type: 'success', text1: 'Reservation Cancelled' });
  } catch (error: any) {
    const msg = parseApiError(error);
    yield put(cancelReservationFailure(msg));
    Toast.show({ type: 'error', text1: 'Cancel Failed', text2: msg });
  }
}

function* handleFetchAdminReservations(action: ReturnType<typeof fetchAdminReservationsRequest>): Generator {
  try {
    const response = (yield call([reservationApi, reservationApi.getAdminReservations], action.payload)) as AxiosResponse<any>;
    yield put(fetchAdminReservationsSuccess(response.data.data ?? []));
  } catch (error: any) {
    yield put(fetchAdminReservationsFailure(parseApiError(error)));
  }
}

function* handleFetchAdminReservationById(action: ReturnType<typeof fetchAdminReservationByIdRequest>): Generator {
  try {
    const response = (yield call([reservationApi, reservationApi.getAdminReservationById], action.payload)) as AxiosResponse<any>;
    yield put(fetchAdminReservationByIdSuccess(response.data.data));
  } catch (error: any) {
    yield put(fetchAdminReservationByIdFailure(parseApiError(error)));
  }
}

function* handleAdminCreateReservation(action: ReturnType<typeof adminCreateReservationRequest>): Generator {
  try {
    const p = action.payload as any;

    // Walk-in customer flow: if walkIn data provided, register/look up customer first
    let customerId = String(p.customerId ?? p.customer_id ?? '');

    if (p.walkIn) {
      try {
        // Try to register as new customer; password = phone number
        const regResp = (yield call([authApi, authApi.register], {
          name: p.walkIn.name,
          email: p.walkIn.email,
          phone: p.walkIn.phone,
          password: p.walkIn.phone,
          role: 'customer' as const,
        })) as AxiosResponse<any>;
        customerId = String(regResp.data.data.user.id);
      } catch (regError: any) {
        // Registration failed - user may already exist
        const errMsg = parseApiError(regError);
        Toast.show({ type: 'error', text1: 'Customer Error', text2: errMsg });
        yield put(adminCreateReservationFailure(errMsg));
        return;
      }
    }

    if (!customerId) {
      yield put(adminCreateReservationFailure('Customer ID is required'));
      Toast.show({ type: 'error', text1: 'No customer ID', text2: 'Could not identify customer' });
      return;
    }

    const payload = toAdminCreatePayload({ ...p, customerId });
    console.log('📤 adminCreateReservation →', JSON.stringify(payload));
    const response = (yield call([reservationApi, reservationApi.adminCreateReservation], payload)) as AxiosResponse<any>;
    yield put(adminCreateReservationSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Reservation Created!' });
  } catch (error: any) {
    const msg = parseApiError(error);
    yield put(adminCreateReservationFailure(msg));
    Toast.show({ type: 'error', text1: 'Failed', text2: msg });
  }
}

function* handleAdminUpdateReservation(action: ReturnType<typeof adminUpdateReservationRequest>): Generator {
  try {
    const { id, ...rest } = action.payload as any;
    const payload = { id, ...toUpdatePayload(rest) };
    const response = (yield call([reservationApi, reservationApi.adminUpdateReservation], payload)) as AxiosResponse<any>;
    yield put(adminUpdateReservationSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Reservation Updated!' });
  } catch (error: any) {
    const msg = parseApiError(error);
    yield put(adminUpdateReservationFailure(msg));
    Toast.show({ type: 'error', text1: 'Update Failed', text2: msg });
  }
}

function* handleAdminUpdateStatus(action: ReturnType<typeof adminUpdateStatusRequest>): Generator {
  try {
    const { id, status } = action.payload;
    console.log('📤 adminUpdateStatus →', id, status);
    // Use [context, method] syntax so `this` is correct inside the api object
    const response = (yield call(
      [reservationApi, reservationApi.adminUpdateStatus],
      id,
      status,
    )) as AxiosResponse<any>;
    yield put(adminUpdateStatusSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Status Updated!' });
  } catch (error: any) {
    const msg = parseApiError(error);
    yield put(adminUpdateStatusFailure(msg));
    Toast.show({ type: 'error', text1: 'Update Failed', text2: msg });
  }
}

function* handleAdminCancelReservation(action: ReturnType<typeof adminCancelReservationRequest>): Generator {
  try {
    yield call([reservationApi, reservationApi.adminCancelReservation], action.payload);
    yield put(adminCancelReservationSuccess(action.payload));
    Toast.show({ type: 'success', text1: 'Reservation Cancelled' });
  } catch (error: any) {
    const msg = parseApiError(error);
    yield put(adminCancelReservationFailure(msg));
    Toast.show({ type: 'error', text1: 'Cancel Failed', text2: msg });
  }
}

export function* reservationSaga() {
  yield takeLatest(fetchMyReservationsRequest.type, handleFetchMyReservations);
  yield takeLatest(fetchMyReservationByIdRequest.type, handleFetchMyReservationById);
  yield takeLatest(fetchAvailabilityRequest.type, handleFetchAvailability);
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