# TableBook – React Native Frontend Documentation
> Last updated: February 2026  
> Status: **Complete (Session 1)**

---

## 1. Project Overview

**TableBook** is a React Native (Expo) mobile app for table reservations. It serves two user roles:
- **Customer** – Browse restaurants, check availability, create/edit/cancel reservations
- **Admin** – Manage restaurant, tables, floor plan, and all reservations

### Tech Stack
| Layer | Technology |
|---|---|
| Framework | React Native (Expo ~51) |
| Language | TypeScript (strict) |
| State Management | Redux Toolkit + Redux Saga |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| HTTP Client | Axios with JWT interceptors |
| Secure Storage | expo-secure-store |
| Toast Notifications | react-native-toast-message |
| Icons | @expo/vector-icons (Ionicons) |
| Date Utilities | date-fns |

---

## 2. File Structure

```
TableReservationApp/
├── App.tsx                          # Root entry: Provider + StatusBar + Toast
├── app.json                         # Expo config
├── babel.config.js
├── package.json
├── tsconfig.json
│
└── src/
    ├── api/
    │   ├── client.ts                # Axios instance + JWT refresh interceptor
    │   ├── authApi.ts               # Login, register, logout, refresh
    │   ├── restaurantApi.ts         # CRUD for restaurants
    │   ├── reservationApi.ts        # Customer + Admin reservation APIs
    │   └── tableApi.ts              # Admin table CRUD + floor plan
    │
    ├── constants/
    │   ├── colors.ts                # All color tokens (light/dark themes + status)
    │   ├── strings.ts               # All UI strings (DRY, no hardcoded text)
    │   ├── layout.ts                # Spacing, FontSize, FontWeight, BorderRadius, Shadow
    │   └── endpoints.ts             # All API endpoint strings
    │
    ├── hooks/
    │   ├── useAppDispatch.ts        # Typed useDispatch + useSelector
    │   └── useTheme.ts              # Returns { mode, colors, primaryColor }
    │
    ├── navigation/
    │   ├── RootNavigator.tsx        # Decides Auth vs Customer vs Admin
    │   ├── AuthNavigator.tsx        # Welcome → Login → Register
    │   ├── CustomerNavigator.tsx    # Tabs + stack screens
    │   └── AdminNavigator.tsx       # Tabs + stack screens
    │
    ├── store/
    │   ├── index.ts                 # configureStore + run rootSaga
    │   ├── slices/
    │   │   ├── authSlice.ts         # Login/register/logout/refresh/hydrate
    │   │   ├── restaurantSlice.ts   # Fetch list, by ID, admin restaurant, CRUD
    │   │   ├── reservationSlice.ts  # Customer + Admin reservation operations
    │   │   ├── tableSlice.ts        # Table CRUD + floor plan
    │   │   └── themeSlice.ts        # Light/dark toggle
    │   └── sagas/
    │       ├── rootSaga.ts          # Combines all sagas
    │       ├── authSaga.ts          # Handles login, register, logout side effects
    │       ├── restaurantSaga.ts    # Restaurant fetch + CRUD saga
    │       ├── reservationSaga.ts   # Full reservation saga (customer + admin)
    │       └── tableSaga.ts         # Table CRUD + floor plan saga
    │
    ├── theme/
    │   └── themeUtils.ts            # getThemeColors(), getStatusColor(), getStatusBgColor()
    │
    ├── types/
    │   └── index.ts                 # ALL TypeScript types (User, Reservation, Table, etc.)
    │
    ├── utils/
    │   ├── storage.ts               # expo-secure-store: saveAuthData, getAuthData, clearAuthData
    │   ├── errorParser.ts           # Maps API error codes (1001–4003) to user-friendly strings
    │   └── dateUtils.ts             # formatDate, formatTime, toApiDate, isEditable
    │
    ├── components/
    │   ├── common/
    │   │   ├── AppButton.tsx / .styles.ts         # Button: primary, outline, ghost, danger; sm/md/lg
    │   │   ├── AppInput.tsx / .styles.ts           # Input with label, error, icons, password toggle
    │   │   ├── StatusBadge.tsx / .styles.ts        # Colored pill badge for reservation status
    │   │   ├── LoadingOverlay.tsx / .styles.ts     # Spinner with optional fullScreen prop
    │   │   ├── EmptyState.tsx / .styles.ts         # Icon + title + message + optional CTA
    │   │   └── FilterBar.tsx / .styles.ts          # Search input + status pill filters
    │   └── customer/
    │       ├── ReservationCard.tsx / .styles.ts    # Reservation list item
    │       └── RestaurantCard.tsx / .styles.ts     # Restaurant list item
    │
    └── screens/
        ├── auth/
        │   ├── WelcomeScreen.tsx / .styles.ts     # Role selector (Customer / Admin)
        │   ├── LoginScreen.tsx                    # Email + password login
        │   ├── RegisterScreen.tsx                 # Name + email + phone + password register
        │   └── AuthScreen.styles.ts               # Shared auth screen styles
        │
        ├── customer/
        │   ├── HomeScreen.tsx / .styles.ts        # Restaurant list with search
        │   ├── RestaurantDetailScreen.tsx / .styles.ts  # Restaurant info + "Reserve" CTA
        │   ├── NewReservationScreen.tsx / .styles.ts    # Date + guests + slot picker + form
        │   ├── EditReservationScreen.tsx          # Same form, pre-filled
        │   ├── MyReservationsScreen.tsx / .styles.ts    # List with filter bar
        │   ├── ReservationDetailScreen.tsx / .styles.ts # Detail + edit/cancel actions
        │   └── ProfileScreen.tsx / .styles.ts     # User info + dark mode toggle + sign out
        │
        └── admin/
            ├── AdminDashboardScreen.tsx / .styles.ts   # Stats: today count + by-status grid
            ├── AdminReservationsScreen.tsx              # Admin list view (with customer column)
            ├── AdminReservationDetailScreen.tsx         # Status transitions + edit link
            ├── AdminNewReservationScreen.tsx            # Create reservation for restaurant
            ├── AdminEditReservationScreen.tsx           # Edit any reservation
            ├── AdminTablesScreen.tsx / .styles.ts       # Table list + add/edit/delete
            ├── AdminTableFormScreen.tsx                 # Add/edit table (label, capacity, grid pos)
            └── AdminFloorPlanScreen.tsx / .styles.ts    # Grid view with live availability colors
```

---

## 3. Architecture Decisions

### State Management
Each domain (auth, restaurant, reservation, table, theme) has its own Redux slice. Each slice exports:
- **Request action** – triggers saga (carries payload)
- **Success action** – updates state
- **Failure action** – sets error string

Sagas subscribe via `takeLatest`, call the API service, then dispatch success/failure. Toast notifications are called from sagas, not components.

### Token Refresh
The Axios interceptor in `src/api/client.ts`:
1. Attaches `Bearer` token from Redux store on every request
2. On 401, queues failed requests, refreshes via `/api/auth/refresh`
3. Retries queued requests with new token
4. Dispatches `logoutAction` if refresh fails

### Navigation Flow
```
RootNavigator
├── NOT authenticated → AuthNavigator (Welcome → Login/Register)
├── CUSTOMER role     → CustomerNavigator (tabs + nested screens)
└── ADMIN role        → AdminNavigator (tabs + nested screens)
```

Session persists across app restarts via `expo-secure-store`. On app launch, `RootNavigator` calls `storageUtils.getAuthData()` and dispatches `hydrateAuth`.

### Theming
- Colors defined in `src/constants/colors.ts` with `light` and `dark` sub-objects
- `useTheme()` hook returns `{ mode, colors, primaryColor }`
- All styles are in separate `.styles.ts` files using `StyleSheet.create()` inside factory functions that accept `colors`
- No inline styles anywhere

---

## 4. What's Implemented

| Feature | Status |
|---|---|
| Auth: Login/Register (Customer + Admin) | ✅ |
| Secure token storage & auto-restore | ✅ |
| JWT refresh interceptor | ✅ |
| Light/Dark theme with toggle | ✅ |
| Restaurant listing with search | ✅ |
| Restaurant detail | ✅ |
| Check time slot availability | ✅ |
| Create reservation (customer) | ✅ |
| Edit reservation (customer) | ✅ |
| Cancel reservation (customer) | ✅ |
| View my reservations with filters | ✅ |
| Admin dashboard with stats | ✅ |
| Admin reservation list with filters | ✅ |
| Admin reservation detail + status transitions | ✅ |
| Admin create/edit reservation | ✅ |
| Admin table management (CRUD) | ✅ |
| Admin floor plan viewer | ✅ |
| Toast notifications (no Alert for API errors) | ✅ |
| Error handling with code mapping | ✅ |
| Filter by status, search by name/date | ✅ |
| Pull-to-refresh on all lists | ✅ |
| Empty states | ✅ |
| Loading states | ✅ |

---

## 5. What Remains / Next Session TODO

If continuing in a new session, here's what is **not yet done** or can be improved:

### High Priority
- [ ] **Admin Restaurant Form** – `AdminRestaurantFormScreen` is declared in navigator but renders `null`. Implement the create/update restaurant form similar to `AdminTableFormScreen`.
- [ ] **Edit Reservation (Admin) fix** – The navigator currently uses `AdminEditReservationScreen`, verify `route.params` typing matches `AdminStackParamList`.
- [ ] **Double-booking UI guard** – Already handled backend-side. Frontend already shows "No tables available" error. Could add a visual warning if user selects a date/time that recently failed.

### Medium Priority
- [ ] **Date picker** – Currently uses plain text input for date. Replace with a native date picker (e.g., `@react-native-community/datetimepicker` or `expo-datetimepicker`).
- [ ] **Time picker** – Same as above for time slot selection.
- [ ] **Admin profile screen** – Currently reuses customer `ProfileScreen`. Could add restaurant management links.
- [ ] **Pagination** – Lists currently fetch all records. Add pagination or infinite scroll for large datasets.

### Low Priority
- [ ] Haptic feedback on button press
- [ ] Skeleton loading screens instead of spinners
- [ ] Reservation history graph on admin dashboard
- [ ] Push notifications for reservation status changes

---

## 6. API Integration Notes

**Base URL**: Set in `src/constants/endpoints.ts` → `API_BASE_URL = 'http://localhost:3000'`  
Change this to your server URL before running.

**Error Code Map** (in `src/utils/errorParser.ts`):
| Code | Meaning |
|------|---------|
| 1001 | Invalid credentials |
| 1002 | Token expired |
| 1003 | Email already exists |
| 2001 | Invalid date |
| 2002 | Past date |
| 2004 | Invalid time slot |
| 3001 | No tables available |
| 3003 | Reservation not editable |
| 3004 | Invalid status transition |
| 4001 | Restaurant not found |
| 4002 | Table not found |
| 4003 | Reservation not found |

---

## 7. Running the Project

```bash
cd TableReservationApp
npm install
npx expo start
```

For Android: `npm run android`  
For iOS: `npm run ios`

> Requires: Node 18+, Expo CLI, Android Studio / Xcode

---

## 8. Design System

**Primary Color**: `#C0392B` (deep red)  
**Theme**: White/red in light, dark gray/red in dark

**Components follow this pattern**:
```
ComponentName.tsx        → logic + JSX (no inline styles)
ComponentName.styles.ts  → StyleSheet.create() factory function
```

All spacing uses `Spacing.*`, fonts use `FontSize.*`, radii use `BorderRadius.*` from `src/constants/layout.ts`.
