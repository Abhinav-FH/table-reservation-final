// Valid reservation times: 10:00 to 20:00 (last slot), 30-min intervals, 2h duration
export const SLOT_INTERVAL_MINUTES = 30;
export const DURATION_HOURS = 2;
export const FIRST_SLOT = '10:00';
export const LAST_SLOT = '20:00';

export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  let hour = 10;
  let minute = 0;

  while (hour < 20 || (hour === 20 && minute === 0)) {
    const h = String(hour).padStart(2, '0');
    const m = String(minute).padStart(2, '0');
    slots.push(`${h}:${m}`);
    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }

  return slots;
};

export const addHours = (time: string, hours: number): string => {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + hours * 60;
  const newHour = Math.floor(totalMinutes / 60);
  const newMinute = totalMinutes % 60;
  return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
};

export const isValidTimeSlot = (time: string): boolean => {
  return generateTimeSlots().includes(time);
};

export const getEndTime = (startTime: string): string => {
  return addHours(startTime, DURATION_HOURS);
};

/**
 * Check if two time ranges overlap.
 * Overlap condition: existing.start < new.end AND existing.end > new.start
 */
export const timesOverlap = (
  existingStart: string,
  existingEnd: string,
  newStart: string,
  newEnd: string
): boolean => {
  return existingStart < newEnd && existingEnd > newStart;
};
