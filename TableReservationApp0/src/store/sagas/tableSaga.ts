import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { tableApi } from '../../api/tableApi';
import {
  fetchTablesRequest,
  fetchTablesSuccess,
  fetchTablesFailure,
  fetchFloorPlanRequest,
  fetchFloorPlanSuccess,
  fetchFloorPlanFailure,
  addTableRequest,
  addTableSuccess,
  addTableFailure,
  updateTableRequest,
  updateTableSuccess,
  updateTableFailure,
  removeTableRequest,
  removeTableSuccess,
  removeTableFailure,
} from '../slices/tableSlice';
import { parseApiError } from '../../utils/errorParser';
import Toast from 'react-native-toast-message';
import { Strings } from '../../constants/strings';

function* handleFetchTables(): Generator {
  try {
    const response = (yield call(tableApi.getAll)) as AxiosResponse<any>;
    yield put(fetchTablesSuccess(response.data.data));
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(fetchTablesFailure(message));
  }
}

function* handleFetchFloorPlan(action: ReturnType<typeof fetchFloorPlanRequest>): Generator {
  try {
    const response = (yield call(tableApi.getFloorPlan, action.payload)) as AxiosResponse<any>;
    yield put(fetchFloorPlanSuccess(response.data.data));
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(fetchFloorPlanFailure(message));
  }
}

function* handleAddTable(action: ReturnType<typeof addTableRequest>): Generator {
  try {
    const response = (yield call(tableApi.add, action.payload)) as AxiosResponse<any>;
    yield put(addTableSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Table Added', text2: Strings.successTableAdded });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(addTableFailure(message));
    Toast.show({ type: 'error', text1: 'Error', text2: message });
  }
}

function* handleUpdateTable(action: ReturnType<typeof updateTableRequest>): Generator {
  try {
    const response = (yield call(
      tableApi.update,
      action.payload.id,
      action.payload.payload,
    )) as AxiosResponse<any>;
    yield put(updateTableSuccess(response.data.data));
    Toast.show({ type: 'success', text1: 'Updated', text2: Strings.successTableUpdated });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(updateTableFailure(message));
    Toast.show({ type: 'error', text1: 'Error', text2: message });
  }
}

function* handleRemoveTable(action: ReturnType<typeof removeTableRequest>): Generator {
  try {
    yield call(tableApi.remove, action.payload);
    yield put(removeTableSuccess(action.payload));
    Toast.show({ type: 'success', text1: 'Removed', text2: Strings.successTableDeleted });
  } catch (error: any) {
    const message = parseApiError(error);
    yield put(removeTableFailure(message));
    Toast.show({ type: 'error', text1: 'Error', text2: message });
  }
}

export function* tableSaga() {
  yield takeLatest(fetchTablesRequest.type, handleFetchTables);
  yield takeLatest(fetchFloorPlanRequest.type, handleFetchFloorPlan);
  yield takeLatest(addTableRequest.type, handleAddTable);
  yield takeLatest(updateTableRequest.type, handleUpdateTable);
  yield takeLatest(removeTableRequest.type, handleRemoveTable);
}
