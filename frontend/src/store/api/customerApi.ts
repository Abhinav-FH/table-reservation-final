import { baseApi } from './baseApi';

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  grid_rows: number;
  grid_cols: number;
  activeTableCount?: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  tableCount: number;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurant?: Restaurant;
  reservationDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  specialRequests?: string;
  tables?: Array<{ id: string; label: string; capacity: number }>;
  createdAt: string;
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listRestaurants: build.query<{ success: boolean; data: Restaurant[] }, void>({
      query: () => '/restaurants',
      providesTags: ['Restaurant'],
    }),

    getRestaurant: build.query<{ success: boolean; data: Restaurant }, string>({
      query: (id) => `/restaurants/${id}`,
      providesTags: ['Restaurant'],
    }),

    getAvailability: build.query<
      { success: boolean; data: TimeSlot[] },
      { restaurantId: string; date: string; guestCount: number }
    >({
      query: ({ restaurantId, date, guestCount }) =>
        `/reservations/availability?restaurantId=${restaurantId}&date=${date}&guestCount=${guestCount}`,
    }),

    getMyReservations: build.query<
      { success: boolean; data: Reservation[] },
      { date?: string; status?: string } | void
    >({
      query: (params) => {
        const qs = params
          ? '?' + new URLSearchParams(params as Record<string, string>).toString()
          : '';
        return `/reservations/my${qs}`;
      },
      providesTags: ['Reservation'],
    }),

    getMyReservation: build.query<{ success: boolean; data: Reservation }, string>({
      query: (id) => `/reservations/my/${id}`,
      providesTags: ['Reservation'],
    }),

    createReservation: build.mutation<
      { success: boolean; data: Reservation },
      {
        restaurantId: string;
        reservationDate: string;
        startTime: string;
        guestCount: number;
        specialRequests?: string;
      }
    >({
      query: (body) => ({ url: '/reservations/my', method: 'POST', body }),
      invalidatesTags: ['Reservation'],
    }),

    updateReservation: build.mutation<
      { success: boolean; data: Reservation },
      { id: string; reservationDate?: string; startTime?: string; guestCount?: number; specialRequests?: string }
    >({
      query: ({ id, ...body }) => ({ url: `/reservations/my/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Reservation'],
    }),

    cancelReservation: build.mutation<void, string>({
      query: (id) => ({ url: `/reservations/my/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Reservation'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListRestaurantsQuery,
  useGetRestaurantQuery,
  useGetAvailabilityQuery,
  useGetMyReservationsQuery,
  useGetMyReservationQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useCancelReservationMutation,
} = customerApi;