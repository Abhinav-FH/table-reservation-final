import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { tableApi } from '../../api/tableApi';
import {
  fetchTablesRequest, fetchTablesSuccess, fetchTablesFailure,
  fetchFloorPlanRequest, fetchFloorPlanSuccess, fetchFloorPlanFailure,
  addTableRequest, addTableSuccess, addTableFailure,
  updateTableRequest, updateTableSuccess, updateTableFailure,
  removeTableRequest, removeTableSuccess, removeTableFailure,
} from '../slices/tableSlice';
import { parseApiError } from '../../utils/errorParser';
import Toast from 'react-native-toast-message';
import { Strings } from '../../constants/strings';
import { Table } from '../../types';

// Backend may return isActive (camelCase) OR is_active (snake_case).
// Normalize everything to is_active so our types/rendering always works.
function normalizeTable(t: any): Table {
  return {
    ...t,
    is_active: t.is_active ?? t.isActive ?? false,
    grid_row: t.grid_row ?? t.gridRow ?? 0,
    grid_col: t.grid_col ?? t.gridCol ?? 0,
  };
}

// Convert frontend (snake_case per our types) → camelCase for backend
function toTablePayload(p: any) {
  return {
    label: p.label,
    capacity: Number(p.capacity),
    isActive: p.is_active ?? p.isActive ?? true,
    gridRow: Number(p.grid_row ?? p.gridRow ?? 0),
    gridCol: Number(p.grid_col ?? p.gridCol ?? 0),
  };
}

function* handleFetchTables(): Generator {
  try {
    const response = (yield call([tableApi, tableApi.getAll])) as AxiosResponse<any>;
    const raw: any[] = response.data.data ?? [];
    yield put(fetchTablesSuccess(raw.map(normalizeTable)));
  } catch (error: any) {
    yield put(fetchTablesFailure(parseApiError(error)));
  }
}

function* handleFetchFloorPlan(action: ReturnType<typeof fetchFloorPlanRequest>): Generator {
  try {
    const response = (yield call([tableApi, tableApi.getFloorPlan], action.payload)) as AxiosResponse<any>;
    yield put(fetchFloorPlanSuccess(response.data.data ?? []));
  } catch (error: any) {
    yield put(fetchFloorPlanFailure(parseApiError(error)));
  }
}

function* handleAddTable(action: ReturnType<typeof addTableRequest>): Generator {
  try {
    const payload = toTablePayload(action.payload);
    console.log('📤 addTable →', JSON.stringify(payload));
    const response = (yield call([tableApi, tableApi.add], payload)) as AxiosResponse<any>;
    yield put(addTableSuccess(normalizeTable(response.data.data)));
    Toast.show({ type: 'success', text1: 'Table Added', text2: Strings.successTableAdded });
  } catch (error: any) {
    const msg = parseApiError(error);
    yield put(addTableFailure(msg));
    Toast.show({ type: 'error', text1: 'Error', text2: msg });
  }
}

function* handleUpdateTable(action: ReturnType<typeof updateTableRequest>): Generator {
  try {
    const payload = toTablePayload(action.payload.payload);
    console.log('📤 updateTable →', JSON.stringify(payload));
    const response = (yield call([tableApi, tableApi.update], action.payload.id, payload)) as AxiosResponse<any>;
    yield put(updateTableSuccess(normalizeTable(response.data.data)));
    Toast.show({ type: 'success', text1: 'Updated', text2: Strings.successTableUpdated });
  } catch (error: any) {
    const msg = parseApiError(error);
    yield put(updateTableFailure(msg));
    Toast.show({ type: 'error', text1: 'Error', text2: msg });
  }
}

function* handleRemoveTable(action: ReturnType<typeof removeTableRequest>): Generator {
  try {
    yield call([tableApi, tableApi.remove], action.payload);
    yield put(removeTableSuccess(action.payload));
    Toast.show({ type: 'success', text1: 'Removed', text2: Strings.successTableDeleted });
  } catch (error: any) {
    const msg = parseApiError(error);
    yield put(removeTableFailure(msg));
    Toast.show({ type: 'error', text1: 'Error', text2: msg });
  }
}

export function* tableSaga() {
  yield takeLatest(fetchTablesRequest.type, handleFetchTables);
  yield takeLatest(fetchFloorPlanRequest.type, handleFetchFloorPlan);
  yield takeLatest(addTableRequest.type, handleAddTable);
  yield takeLatest(updateTableRequest.type, handleUpdateTable);
  yield takeLatest(removeTableRequest.type, handleRemoveTable);
}