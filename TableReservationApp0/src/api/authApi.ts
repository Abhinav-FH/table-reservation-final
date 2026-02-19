import apiClient from './client';
import { Endpoints } from '../constants/endpoints';
import { LoginPayload, RegisterPayload, ApiResponse } from '../types';

interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponseData>>(Endpoints.login, payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<AuthResponseData>>(Endpoints.register, payload),

  logout: (refreshToken: string) =>
    apiClient.post(Endpoints.logout, { refreshToken }),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthResponseData>>(Endpoints.refresh, { refreshToken }),
};
