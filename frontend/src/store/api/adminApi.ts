import { baseApi } from './baseApi';
import { Reservation, Restaurant } from './customerApi';

export interface Table {
  id: string;
  restaurantId: string;
  label: string;
  capacity: 2 | 4 | 6;
  grid_row: number;
  grid_col: number;
  is_active: boolean;
}

export interface FloorPlanTable extends Table {
  status: 'available' | 'booked' | 'disabled';
  reservations?: Reservation[];
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // --- Restaurant ---
    getAdminRestaurant: build.query<{ success: boolean; data: Restaurant & { tables: Table[] } }, void>({
      query: () => '/restaurants/admin/me',
      providesTags: ['Restaurant'],
    }),
    createRestaurant: build.mutation<{ success: boolean; data: Restaurant }, Partial<Restaurant>>({
      query: (body) => ({ url: '/restaurants/admin', method: 'POST', body }),
      invalidatesTags: ['Restaurant'],
    }),
    updateRestaurant: build.mutation<{ success: boolean; data: Restaurant }, Partial<Restaurant>>({
      query: (body) => ({ url: '/restaurants/admin', method: 'PATCH', body }),
      invalidatesTags: ['Restaurant', 'FloorPlan'],
    }),

    // --- Tables ---
    listAdminTables: build.query<{ success: boolean; data: Table[] }, void>({
      query: () => '/admin/tables',
      providesTags: ['Table'],
    }),
    getFloorPlan: build.query<
      { success: boolean; data: { grid: (FloorPlanTable | null)[][]; restaurant: Restaurant } },
      string // date YYYY-MM-DD
    >({
      query: (date) => `/admin/tables/floor-plan?date=${date}`,
      providesTags: ['FloorPlan'],
    }),
    createTable: build.mutation<{ success: boolean; data: Table }, Partial<Table>>({
      query: (body) => ({ url: '/admin/tables', method: 'POST', body }),
      invalidatesTags: ['Table', 'FloorPlan'],
    }),
    updateTable: build.mutation<{ success: boolean; data: Table }, { id: string } & Partial<Table>>({
      query: ({ id, ...body }) => ({ url: `/admin/tables/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Table', 'FloorPlan'],
    }),
    deleteTable: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/tables/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Table', 'FloorPlan'],
    }),

    // --- Admin Reservations ---
    listAdminReservations: build.query<
      { success: boolean; data: Reservation[]; meta?: { total: number; page: number; limit: number } },
      { date?: string; status?: string; tableId?: string; guestName?: string; page?: number; limit?: number }
    >({
      query: (params) => {
        const qs = '?' + new URLSearchParams(
          Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))
        ).toString();
        return `/reservations/admin${qs}`;
      },
      providesTags: ['Reservation'],
    }),
    getAdminReservation: build.query<{ success: boolean; data: Reservation }, string>({
      query: (id) => `/reservations/admin/${id}`,
      providesTags: ['Reservation'],
    }),
    adminCreateReservation: build.mutation<
      { success: boolean; data: Reservation; bumped?: number },
      {
        customerId: string;
        restaurantId: string;
        tableIds: string[];
        reservationDate: string;
        startTime: string;
        guestCount: number;
        specialRequests?: string;
      }
    >({
      query: (body) => ({ url: '/reservations/admin', method: 'POST', body }),
      invalidatesTags: ['Reservation', 'FloorPlan'],
    }),
    adminUpdateReservation: build.mutation<
      { success: boolean; data: Reservation },
      { id: string; [key: string]: unknown }
    >({
      query: ({ id, ...body }) => ({ url: `/reservations/admin/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Reservation', 'FloorPlan'],
    }),
    adminUpdateStatus: build.mutation<
      { success: boolean; data: Reservation },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({ url: `/reservations/admin/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Reservation', 'FloorPlan'],
    }),
    adminCancelReservation: build.mutation<void, string>({
      query: (id) => ({ url: `/reservations/admin/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Reservation', 'FloorPlan'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminRestaurantQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useListAdminTablesQuery,
  useGetFloorPlanQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  useListAdminReservationsQuery,
  useGetAdminReservationQuery,
  useAdminCreateReservationMutation,
  useAdminUpdateReservationMutation,
  useAdminUpdateStatusMutation,
  useAdminCancelReservationMutation,
} = adminApi;