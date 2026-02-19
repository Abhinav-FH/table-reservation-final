export const ErrorCodes = {
  // 1000-1099: Auth
  INVALID_CREDENTIALS: 1001,
  TOKEN_EXPIRED: 1002,
  EMAIL_EXISTS: 1003,
  UNAUTHORIZED: 1004,
  FORBIDDEN: 1005,

  // 2000-2099: Validation
  INVALID_DATE: 2001,
  PAST_DATE: 2002,
  INVALID_TIME_SLOT: 2004,
  INVALID_GUEST_COUNT: 2005,
  INVALID_CAPACITY: 2006,

  // 3000-3099: Business Logic
  NO_TABLES_AVAILABLE: 3001,
  TABLE_CONFLICT: 3002,
  RESERVATION_NOT_EDITABLE: 3003,
  INVALID_STATUS_TRANSITION: 3004,
  MAX_TABLES_REACHED: 3005,
  GRID_CELL_OCCUPIED: 3006,
  INSUFFICIENT_CAPACITY: 3007,
  TABLE_NOT_ACTIVE: 3008,
  RESTAURANT_ALREADY_EXISTS: 3009,

  // 4000-4099: Not Found
  RESTAURANT_NOT_FOUND: 4001,
  TABLE_NOT_FOUND: 4002,
  RESERVATION_NOT_FOUND: 4003,
  CUSTOMER_NOT_FOUND: 4004,
  PHONE_NOT_FOUND: 4005,
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;

  constructor(statusCode: number, code: ErrorCode, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
