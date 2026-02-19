import apiClient from './client';
import { Endpoints } from '../constants/endpoints';
import { Restaurant, ApiResponse } from '../types';

export const restaurantApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Restaurant[]>>(Endpoints.restaurants),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Restaurant>>(Endpoints.restaurantById(id)),

  getAdminRestaurant: () =>
    apiClient.get<ApiResponse<Restaurant>>(Endpoints.adminRestaurant),

  createRestaurant: (payload: Partial<Restaurant>) =>
    apiClient.post<ApiResponse<Restaurant>>(Endpoints.createAdminRestaurant, payload),

  updateRestaurant: (payload: Partial<Restaurant>) =>
    apiClient.patch<ApiResponse<Restaurant>>(Endpoints.updateAdminRestaurant, payload),
};
