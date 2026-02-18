import { baseApi } from './baseApi';

interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: { id: string; name: string; email: string; role: 'customer' | 'admin' };
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<
      AuthResponse,
      { email: string; password: string; role: 'customer' | 'admin' }
    >({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),

    register: build.mutation<
      AuthResponse,
      {
        name: string;
        email: string;
        password: string;
        phone?: string;
        role: 'customer' | 'admin';
      }
    >({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),

    refreshToken: build.mutation<
      { success: boolean; data: { accessToken: string; refreshToken: string } },
      { refreshToken: string }
    >({
      query: (body) => ({ url: '/auth/refresh', method: 'POST', body }),
    }),

    logoutUser: build.mutation<void, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/logout', method: 'POST', body }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
} = authApi;