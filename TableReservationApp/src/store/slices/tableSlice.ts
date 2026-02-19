import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableState, Table } from '../../types';

const initialState: TableState = {
  list: [],
  floorPlan: [],
  isLoading: false,
  error: null,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    fetchTablesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTablesSuccess: (state, action: PayloadAction<Table[]>) => {
      state.isLoading = false;
      state.list = action.payload;
    },
    fetchTablesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchFloorPlanRequest: (state, _action: PayloadAction<string | undefined>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchFloorPlanSuccess: (state, action: PayloadAction<Table[][]>) => {
      state.isLoading = false;
      state.floorPlan = action.payload;
    },
    fetchFloorPlanFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    addTableRequest: (state, _action: PayloadAction<Partial<Table>>) => {
      state.isLoading = true;
      state.error = null;
    },
    addTableSuccess: (state, action: PayloadAction<Table>) => {
      state.isLoading = false;
      state.list = [...state.list, action.payload];
    },
    addTableFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateTableRequest: (
      state,
      _action: PayloadAction<{ id: number; payload: Partial<Table> }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    updateTableSuccess: (state, action: PayloadAction<Table>) => {
      state.isLoading = false;
      state.list = state.list.map((t) => (t.id === action.payload.id ? action.payload : t));
    },
    updateTableFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    removeTableRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    removeTableSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
    removeTableFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearTableError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  clearTableError,
} = tableSlice.actions;

export default tableSlice.reducer;
