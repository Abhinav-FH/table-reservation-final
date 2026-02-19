import apiClient from './client';
import { Endpoints } from '../constants/endpoints';
import {
  Reservation,
  TimeSlot,
  ReservationFilters,
  CreateReservationPayload,
  UpdateReservationPayload,
  AdminCreateReservationPayload,
  ReservationStatus,
  ApiResponse,
} from '../types';

export const reservationApi = {
  // Customer
  getAvailability: (params: { restaurantId: number; date: string; guestCount: number }) =>
    apiClient.get<ApiResponse<TimeSlot[]>>(Endpoints.availability, { params }),

  getMyReservations: (filters?: ReservationFilters) =>
    apiClient.get<ApiResponse<Reservation[]>>(Endpoints.myReservations, { params: filters }),

  getMyReservationById: (id: number) =>
    apiClient.get<ApiResponse<Reservation>>(Endpoints.myReservationById(id)),

  createReservation: (payload: CreateReservationPayload) =>
    apiClient.post<ApiResponse<Reservation>>(Endpoints.myReservations, payload),

  updateReservation: ({ id, ...payload }: UpdateReservationPayload) =>
    apiClient.patch<ApiResponse<Reservation>>(Endpoints.myReservationById(id), payload),

  cancelReservation: (id: number) =>
    apiClient.delete<ApiResponse<Reservation>>(Endpoints.myReservationById(id)),

  // Admin
  getAdminReservations: (filters?: ReservationFilters) =>
    apiClient.get<ApiResponse<Reservation[]>>(Endpoints.adminReservations, { params: filters }),

  getAdminReservationById: (id: number) =>
    apiClient.get<ApiResponse<Reservation>>(Endpoints.adminReservationById(id)),

  adminCreateReservation: (payload: AdminCreateReservationPayload) =>
    apiClient.post<ApiResponse<Reservation>>(Endpoints.adminReservations, payload),

  adminUpdateReservation: ({ id, ...payload }: UpdateReservationPayload) =>
    apiClient.patch<ApiResponse<Reservation>>(Endpoints.adminReservationById(id), payload),

  adminUpdateStatus: (id: number, status: ReservationStatus) =>
    apiClient.patch<ApiResponse<Reservation>>(Endpoints.adminReservationStatus(id), { status }),

  adminCancelReservation: (id: number) =>
    apiClient.delete<ApiResponse<Reservation>>(Endpoints.adminReservationById(id)),
};
