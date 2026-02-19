export const API_BASE_URL = 'http://localhost:3000';

export const Endpoints = {
  // Auth
  register: '/api/auth/register',
  login: '/api/auth/login',
  refresh: '/api/auth/refresh',
  logout: '/api/auth/logout',

  // Customer - Restaurants
  restaurants: '/api/restaurants',
  restaurantById: (id: number | string) => `/api/restaurants/${id}`,

  // Customer - Reservations
  availability: '/api/reservations/availability',
  myReservations: '/api/reservations/my',
  myReservationById: (id: number | string) => `/api/reservations/my/${id}`,

  // Admin - Restaurant
  adminRestaurant: '/api/restaurants/admin/me',
  createAdminRestaurant: '/api/restaurants/admin',
  updateAdminRestaurant: '/api/restaurants/admin',

  // Admin - Tables
  adminTables: '/api/admin/tables',
  adminTableById: (id: number | string) => `/api/admin/tables/${id}`,
  adminFloorPlan: '/api/admin/tables/floor-plan',

  // Admin - Reservations
  adminReservations: '/api/reservations/admin',
  adminReservationById: (id: number | string) => `/api/reservations/admin/${id}`,
  adminReservationStatus: (id: number | string) => `/api/reservations/admin/${id}/status`,
};
