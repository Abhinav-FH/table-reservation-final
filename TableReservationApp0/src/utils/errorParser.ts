import { AxiosError } from 'axios';
import { Strings } from '../constants/strings';

const ERROR_CODE_MAP: Record<number, string> = {
  1001: Strings.errorInvalidCredentials,
  1002: 'Session expired. Please log in again.',
  1003: Strings.errorEmailExists,
  2001: 'Invalid date format.',
  2002: Strings.errorPastDate,
  2004: Strings.errorInvalidTimeSlot,
  3001: Strings.errorNoTablesAvailable,
  3003: Strings.errorNotEditable,
  3004: 'Invalid status transition.',
  4001: 'Restaurant not found.',
  4002: 'Table not found.',
  4003: 'Reservation not found.',
};

export function parseApiError(error: AxiosError | any): string {
  if (error?.response?.data?.code) {
    const mapped = ERROR_CODE_MAP[error.response.data.code];
    if (mapped) return mapped;
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message === 'Network Error') {
    return Strings.errorNetwork;
  }
  return Strings.errorGeneric;
}
