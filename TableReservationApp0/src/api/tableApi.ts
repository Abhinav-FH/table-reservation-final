import apiClient from './client';
import { Endpoints } from '../constants/endpoints';
import { Table, ApiResponse } from '../types';

export const tableApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Table[]>>(Endpoints.adminTables),

  add: (payload: Partial<Table>) =>
    apiClient.post<ApiResponse<Table>>(Endpoints.adminTables, payload),

  update: (id: number, payload: Partial<Table>) =>
    apiClient.patch<ApiResponse<Table>>(Endpoints.adminTableById(id), payload),

  remove: (id: number) =>
    apiClient.delete<ApiResponse<{ message: string }>>(Endpoints.adminTableById(id)),

  getFloorPlan: (date?: string) =>
    apiClient.get<ApiResponse<Table[][]>>(Endpoints.adminFloorPlan, {
      params: date ? { date } : undefined,
    }),
};
