import { Colors } from '../constants/colors';
import { Theme } from '../types';

export type ThemeColors = typeof Colors.light;

export function getThemeColors(mode: Theme): ThemeColors {
  return mode === 'dark' ? Colors.dark : Colors.light;
}

export function getStatusColor(status: string, mode: Theme): string {
  const map: Record<string, string> = {
    PENDING: Colors.statusPending,
    CONFIRMED: Colors.statusConfirmed,
    CANCELLED: Colors.statusCancelled,
    COMPLETED: Colors.statusCompleted,
  };
  return map[status] ?? Colors.statusPending;
}

export function getStatusBgColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: Colors.warningLight,
    CONFIRMED: Colors.successLight,
    CANCELLED: Colors.errorLight,
    COMPLETED: Colors.infoLight,
  };
  return map[status] ?? Colors.warningLight;
}
