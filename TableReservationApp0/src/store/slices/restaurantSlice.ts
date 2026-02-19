import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RestaurantState, Restaurant } from '../../types';

const initialState: RestaurantState = {
  list: [],
  selected: null,
  adminRestaurant: null,
  isLoading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    fetchRestaurantsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRestaurantsSuccess: (state, action: PayloadAction<Restaurant[]>) => {
      state.isLoading = false;
      state.list = action.payload;
    },
    fetchRestaurantsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchRestaurantByIdRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRestaurantByIdSuccess: (state, action: PayloadAction<Restaurant>) => {
      state.isLoading = false;
      state.selected = action.payload;
    },
    fetchRestaurantByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchAdminRestaurantRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAdminRestaurantSuccess: (state, action: PayloadAction<Restaurant>) => {
      state.isLoading = false;
      state.adminRestaurant = action.payload;
    },
    fetchAdminRestaurantFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    createRestaurantRequest: (state, _action: PayloadAction<Partial<Restaurant>>) => {
      state.isLoading = true;
      state.error = null;
    },
    createRestaurantSuccess: (state, action: PayloadAction<Restaurant>) => {
      state.isLoading = false;
      state.adminRestaurant = action.payload;
    },
    createRestaurantFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateRestaurantRequest: (state, _action: PayloadAction<Partial<Restaurant>>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateRestaurantSuccess: (state, action: PayloadAction<Restaurant>) => {
      state.isLoading = false;
      state.adminRestaurant = action.payload;
    },
    updateRestaurantFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearRestaurantError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  clearRestaurantError,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
