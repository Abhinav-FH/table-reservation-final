import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';

export const dateUtils = {
  formatDate: (dateStr: string): string => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return 'Today';
      if (isTomorrow(date)) return 'Tomorrow';
      return format(date, 'EEE, MMM d, yyyy');
    } catch {
      return dateStr;
    }
  },

  formatDateShort: (dateStr: string): string => {
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch {
      return dateStr;
    }
  },

  formatTime: (timeStr: string): string => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours, 10);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${displayHour}:${minutes} ${suffix}`;
    } catch {
      return timeStr;
    }
  },

  toApiDate: (date: Date): string => format(date, 'yyyy-MM-dd'),

  isPastReservation: (dateStr: string, timeStr: string): boolean => {
    try {
      const [h, m] = timeStr.split(':').map(Number);
      const date = parseISO(dateStr);
      date.setHours(h, m);
      return isPast(date);
    } catch {
      return false;
    }
  },

  isEditable: (status: string): boolean => {
    return status === 'PENDING' || status === 'CONFIRMED';
  },
};
