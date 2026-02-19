import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, Endpoints } from '../constants/endpoints';
import { refreshTokenAction, logoutAction } from '../store/slices/authSlice';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { store } = require('../store');
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const { store } = require('../store');
      const state = store.getState();
      const refreshToken = state.auth.refreshToken;
      if (!refreshToken) {
        store.dispatch(logoutAction());
        return Promise.reject(error);
      }
      try {
        const { data } = await axios.post(`${API_BASE_URL}${Endpoints.refresh}`, { refreshToken });
        const newAccessToken = data.data.accessToken;
        store.dispatch(refreshTokenAction({ accessToken: newAccessToken, refreshToken: data.data.refreshToken }));
        processQueue(null, newAccessToken);
        if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { store } = require('../store');
        store.dispatch(logoutAction());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
