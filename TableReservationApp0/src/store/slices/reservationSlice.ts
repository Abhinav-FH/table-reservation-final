import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ReservationState,
  Reservation,
  TimeSlot,
  ReservationFilters,
  CreateReservationPayload,
  UpdateReservationPayload,
  AdminCreateReservationPayload,
  ReservationStatus,
} from '../../types';

const initialState: ReservationState = {
  myList: [],
  adminList: [],
  selected: null,
  timeSlots: [],
  filters: {},
  isLoading: false,
  isSlotLoading: false,
  error: null,
};

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    // Fetch availability
    fetchAvailabilityRequest: (
      state,
      _action: PayloadAction<{ restaurantId: number; date: string; guestCount: number }>,
    ) => {
      state.isSlotLoading = true;
      state.error = null;
      state.timeSlots = [];
    },
    fetchAvailabilitySuccess: (state, action: PayloadAction<TimeSlot[]>) => {
      state.isSlotLoading = false;
      state.timeSlots = action.payload;
    },
    fetchAvailabilityFailure: (state, action: PayloadAction<string>) => {
      state.isSlotLoading = false;
      state.error = action.payload;
    },

    // My reservations
    fetchMyReservationsRequest: (state, _action: PayloadAction<ReservationFilters | undefined>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMyReservationsSuccess: (state, action: PayloadAction<Reservation[]>) => {
      state.isLoading = false;
      state.myList = action.payload;
    },
    fetchMyReservationsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchMyReservationByIdRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMyReservationByIdSuccess: (state, action: PayloadAction<Reservation>) => {
      state.isLoading = false;
      state.selected = action.payload;
    },
    fetchMyReservationByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create / Update / Cancel
    createReservationRequest: (state, _action: PayloadAction<CreateReservationPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    createReservationSuccess: (state, action: PayloadAction<Reservation>) => {
      state.isLoading = false;
      state.myList = [action.payload, ...state.myList];
    },
    createReservationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateReservationRequest: (state, _action: PayloadAction<UpdateReservationPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateReservationSuccess: (state, action: PayloadAction<Reservation>) => {
      state.isLoading = false;
      state.myList = state.myList.map((r) =>
        r.id === action.payload.id ? action.payload : r,
      );
      state.selected = action.payload;
    },
    updateReservationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    cancelReservationRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    cancelReservationSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.myList = state.myList.map((r) =>
        r.id === action.payload ? { ...r, status: 'CANCELLED' as ReservationStatus } : r,
      );
      if (state.selected?.id === action.payload) {
        state.selected = { ...state.selected, status: 'CANCELLED' };
      }
    },
    cancelReservationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Admin reservations
    fetchAdminReservationsRequest: (
      state,
      _action: PayloadAction<ReservationFilters | undefined>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAdminReservationsSuccess: (state, action: PayloadAction<Reservation[]>) => {
      state.isLoading = false;
      state.adminList = action.payload;
    },
    fetchAdminReservationsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchAdminReservationByIdRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAdminReservationByIdSuccess: (state, action: PayloadAction<Reservation>) => {
      state.isLoading = false;
      state.selected = action.payload;
    },
    fetchAdminReservationByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    adminCreateReservationRequest: (
      state,
      _action: PayloadAction<AdminCreateReservationPayload>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    adminCreateReservationSuccess: (state, action: PayloadAction<Reservation>) => {
      state.isLoading = false;
      state.adminList = [action.payload, ...state.adminList];
    },
    adminCreateReservationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    adminUpdateReservationRequest: (state, _action: PayloadAction<UpdateReservationPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    adminUpdateReservationSuccess: (state, action: PayloadAction<Reservation>) => {
      state.isLoading = false;
      state.adminList = state.adminList.map((r) =>
        r.id === action.payload.id ? action.payload : r,
      );
      state.selected = action.payload;
    },
    adminUpdateReservationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    adminUpdateStatusRequest: (
      state,
      _action: PayloadAction<{ id: number; status: ReservationStatus }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    adminUpdateStatusSuccess: (state, action: PayloadAction<Reservation>) => {
      state.isLoading = false;
      state.adminList = state.adminList.map((r) =>
        r.id === action.payload.id ? action.payload : r,
      );
      state.selected = action.payload;
    },
    adminUpdateStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    adminCancelReservationRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    adminCancelReservationSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.adminList = state.adminList.map((r) =>
        r.id === action.payload ? { ...r, status: 'CANCELLED' as ReservationStatus } : r,
      );
    },
    adminCancelReservationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    setFilters: (state, action: PayloadAction<ReservationFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearSelected: (state) => {
      state.selected = null;
    },
    clearTimeSlots: (state) => {
      state.timeSlots = [];
    },
    clearReservationError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  setFilters,
  clearFilters,
  clearSelected,
  clearTimeSlots,
  clearReservationError,
} = reservationSlice.actions;

export default reservationSlice.reducer;
