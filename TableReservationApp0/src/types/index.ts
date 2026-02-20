// ─── Auth ──────────────────────────────────────────────
export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

// ─── Restaurant ────────────────────────────────────────
export interface Restaurant {
  id: number;
  name: string;
  address: string;
  gridRows: number;
  gridCols: number;
  activeTableCount?: number;
}

export interface RestaurantState {
  list: Restaurant[];
  selected: Restaurant | null;
  adminRestaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
}

// ─── Table ─────────────────────────────────────────────
export type TableStatus = 'available' | 'reserved' | 'inactive';

export interface Table {
  id: number;
  restaurantId: number;
  label: string;
  capacity: number;
  gridRow: number;
  gridCol: number;
  isActive: boolean;
  status?: TableStatus;
}

export interface TableState {
  list: Table[];
  floorPlan: Table[][];
  isLoading: boolean;
  error: string | null;
}

// ─── Reservation ───────────────────────────────────────
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type CreatedBy = 'CUSTOMER' | 'ADMIN';

export interface Reservation {
  id: number;
  customerId: number;
  restaurantId: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  status: ReservationStatus;
  specialRequests?: string;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  restaurant?: {
    name: string;
    address: string;
  };
  tables?: Table[];
  reservationTables?: { table: Table }[]; // From includes
}

export interface ReservationFilters {
  date?: string;
  status?: ReservationStatus | '';
  restaurantId?: number | '';
  search?: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
  available_tables: number;
}

export interface ReservationState {
  myList: Reservation[];
  adminList: Reservation[];
  selected: Reservation | null;
  timeSlots: TimeSlot[];
  filters: ReservationFilters;
  isLoading: boolean;
  isSlotLoading: boolean;
  error: string | null;
}

export interface CreateReservationPayload {
  restaurantId: string | number;
  reservationDate: string;
  startTime: string;
  guestCount: number;
  specialRequests?: string;
}

export interface UpdateReservationPayload extends Partial<CreateReservationPayload> {
  id: number;
}

export interface AdminCreateReservationPayload {
  restaurantId: string | number;
  reservationDate: string;
  startTime: string;
  guestCount: number;
  specialRequests?: string;
  customerId?: string | number;
  tableIds?: (string | number)[];
}

// ─── UI ────────────────────────────────────────────────
export type Theme = 'light' | 'dark';

export interface ThemeState {
  mode: Theme;
}

// ─── API Response ──────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  code: number;
  message: string;
}

// ─── Navigation ────────────────────────────────────────
export type AuthStackParamList = {
  Welcome: undefined;
  Login: { role: UserRole };
  Register: { role: UserRole };
};

export type CustomerTabParamList = {
  HomeTab: undefined;
  ReservationsTab: undefined;
  ProfileTab: undefined;
};

export type CustomerStackParamList = {
  CustomerTabs: undefined;
  RestaurantDetail: { restaurantId: number };
  NewReservation: { restaurantId: number };
  ReservationDetail: { reservationId: number };
  EditReservation: { reservationId: number };
};

export type AdminTabParamList = {
  DashboardTab: undefined;
  ReservationsTab: undefined;
  TablesTab: undefined;
  ProfileTab: undefined;
};

export type AdminStackParamList = {
  AdminTabs: undefined;
  AdminReservationDetail: { reservationId: number };
  AdminNewReservation: undefined;
  AdminEditReservation: { reservationId: number };
  AdminTableForm: { tableId?: number };
  AdminRestaurantForm: undefined;
  AdminFloorPlan: undefined;
  AdminSetup: undefined;
};
