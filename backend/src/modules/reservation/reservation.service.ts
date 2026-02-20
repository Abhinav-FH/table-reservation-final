import { prisma } from '../../config/prisma';
import { AppError, ErrorCodes } from '../../utils/errors';
import { getEndTime, isValidTimeSlot, timesOverlap } from '../../utils/timeSlots';
import {
  CreateReservationInput,
  AdminCreateReservationInput,
  UpdateReservationInput,
  AdminUpdateReservationInput,
  UpdateStatusInput,
  ListReservationsQuery,
} from './reservation.schema';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const getBookedTableIds = async (
  restaurantId: bigint,
  reservationDate: Date,
  startTime: string,
  endTime: string,
  excludeReservationId?: bigint
): Promise<Set<string>> => {
  const conflicts = await prisma.reservation.findMany({
    where: {
      restaurantId,
      reservationDate,
      status: { in: ['PENDING', 'CONFIRMED'] },
      id: excludeReservationId ? { not: excludeReservationId } : undefined,
    },
    include: { reservationTables: true },
  });

  const bookedIds = new Set<string>();
  for (const r of conflicts) {
    if (timesOverlap(r.startTime, r.endTime, startTime, endTime)) {
      for (const rt of r.reservationTables) {
        bookedIds.add(String(rt.tableId));
      }
    }
  }
  return bookedIds;
};

const autoAssignTables = async (
  restaurantId: bigint,
  reservationDate: Date,
  startTime: string,
  endTime: string,
  guestCount: number,
  excludeId?: bigint
): Promise<bigint[]> => {
  const activeTables = await prisma.table.findMany({
    where: { restaurantId, isActive: true },
    orderBy: { capacity: 'asc' },
  });

  const bookedIds = await getBookedTableIds(restaurantId, reservationDate, startTime, endTime, excludeId);
  const available = activeTables.filter((t) => !bookedIds.has(String(t.id)));

  // Phase 1: Single table best fit
  const singleFit = available.find((t) => t.capacity >= guestCount);
  if (singleFit) return [singleFit.id];

  // Phase 2: Combine two tables
  const pairs: [typeof available[0], typeof available[0]][] = [];
  for (let i = 0; i < available.length; i++) {
    for (let j = i + 1; j < available.length; j++) {
      if (available[i].capacity + available[j].capacity >= guestCount) {
        pairs.push([available[i], available[j]]);
      }
    }
  }

  if (pairs.length === 0) {
    throw new AppError(409, ErrorCodes.NO_TABLES_AVAILABLE, `No tables available for ${guestCount} guests at ${startTime}`);
  }

  // Sort: total capacity ASC, then max individual ASC
  pairs.sort((a, b) => {
    const sumA = a[0].capacity + a[1].capacity;
    const sumB = b[0].capacity + b[1].capacity;
    if (sumA !== sumB) return sumA - sumB;
    return Math.max(a[0].capacity, a[1].capacity) - Math.max(b[0].capacity, b[1].capacity);
  });

  return [pairs[0][0].id, pairs[0][1].id];
};

const validateDateAndTime = (reservationDate: string, startTime: string) => {
  if (!isValidTimeSlot(startTime)) {
    throw new AppError(400, ErrorCodes.INVALID_TIME_SLOT, `Invalid time slot: ${startTime}. Use 30-minute intervals from 10:00 to 20:00`);
  }

  const date = new Date(reservationDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    throw new AppError(400, ErrorCodes.PAST_DATE, 'Cannot make reservations for past dates');
  }

  return date;
};

const serializeReservation = (r: any) => ({
  ...r,
  id: String(r.id),
  customerId: String(r.customerId),
  restaurantId: String(r.restaurantId),
  customer: r.customer
    ? { ...r.customer, id: String(r.customer.id) }
    : undefined,
  restaurant: r.restaurant
    ? { ...r.restaurant, id: String(r.restaurant.id) }
    : undefined,
  reservationTables: r.reservationTables?.map((rt: any) => ({
    ...rt,
    id: String(rt.id),
    reservationId: String(rt.reservationId),
    tableId: String(rt.tableId),
    table: rt.table ? { ...rt.table, id: String(rt.table.id) } : undefined,
  })),
});

// ─────────────────────────────────────────────────────────────────────────────
// Customer Actions
// ─────────────────────────────────────────────────────────────────────────────

export const createReservation = async (customerId: bigint, input: CreateReservationInput) => {
  const { restaurantId, reservationDate, startTime, guestCount, specialRequests } = input;
  const date = validateDateAndTime(reservationDate, startTime);
  const endTime = getEndTime(startTime);
  const restId = BigInt(restaurantId);

  const tableIds = await autoAssignTables(restId, date, startTime, endTime, guestCount);

  const reservation = await prisma.$transaction(async (tx) => {
    const r = await tx.reservation.create({
      data: {
        customerId,
        restaurantId: restId,
        reservationDate: date,
        startTime,
        endTime,
        guestCount,
        specialRequests,
        status: 'CONFIRMED',
        createdBy: 'CUSTOMER',
        reservationTables: { create: tableIds.map((id) => ({ tableId: id })) },
      },
      include: {
        reservationTables: { include: { table: true } },
        customer: true,
        restaurant: true,
      },
    });
    return r;
  });

  return serializeReservation(reservation);
};

export const getMyReservations = async (customerId: bigint, query: ListReservationsQuery) => {
  const where: any = { customerId };
  if (query.date) where.reservationDate = new Date(query.date);
  if (query.status) where.status = query.status;

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      reservationTables: { include: { table: true } },
      restaurant: true,
    },
    orderBy: [{ reservationDate: 'desc' }, { startTime: 'asc' }],
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  });

  return reservations.map(serializeReservation);
};

export const getReservationById = async (id: bigint, customerId?: bigint) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      reservationTables: { include: { table: true } },
      customer: true,
      restaurant: true,
    },
  });

  if (!reservation) throw new AppError(404, ErrorCodes.RESERVATION_NOT_FOUND, 'Reservation not found');
  if (customerId && reservation.customerId !== customerId) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, 'Access denied');
  }

  return serializeReservation(reservation);
};

export const updateReservation = async (
  id: bigint,
  customerId: bigint,
  input: UpdateReservationInput
) => {
  const existing = await prisma.reservation.findUnique({
    where: { id },
    include: { reservationTables: true },
  });

  if (!existing) throw new AppError(404, ErrorCodes.RESERVATION_NOT_FOUND, 'Reservation not found');
  if (existing.customerId !== customerId) throw new AppError(403, ErrorCodes.FORBIDDEN, 'Access denied');
  if (existing.status === 'CANCELLED' || existing.status === 'COMPLETED') {
    throw new AppError(409, ErrorCodes.RESERVATION_NOT_EDITABLE, 'Cannot edit a cancelled or completed reservation');
  }

  const newDate = input.reservationDate ? validateDateAndTime(input.reservationDate, input.startTime ?? existing.startTime) : existing.reservationDate;
  const newStartTime = input.startTime ?? existing.startTime;
  const newEndTime = getEndTime(newStartTime);
  const newGuestCount = input.guestCount ?? existing.guestCount;
  const date = typeof newDate === 'string' ? new Date(newDate) : newDate;

  // Check if current tables are still valid
  const currentTableIds = existing.reservationTables.map((rt) => rt.tableId);
  const bookedIds = await getBookedTableIds(existing.restaurantId, date, newStartTime, newEndTime, id);
  const currentTablesConflict = currentTableIds.some((tid) => bookedIds.has(String(tid)));

  let finalTableIds = currentTableIds;

  if (currentTablesConflict) {
    // Reassign
    finalTableIds = await autoAssignTables(existing.restaurantId, date, newStartTime, newEndTime, newGuestCount, id);
  } else {
    // Check capacity still sufficient
    const currentTables = await prisma.table.findMany({ where: { id: { in: currentTableIds } } });
    const totalCapacity = currentTables.reduce((sum, t) => sum + t.capacity, 0);
    if (totalCapacity < newGuestCount) {
      finalTableIds = await autoAssignTables(existing.restaurantId, date, newStartTime, newEndTime, newGuestCount, id);
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.reservationTable.deleteMany({ where: { reservationId: id } });

    return tx.reservation.update({
      where: { id },
      data: {
        reservationDate: date,
        startTime: newStartTime,
        endTime: newEndTime,
        guestCount: newGuestCount,
        specialRequests: input.specialRequests ?? existing.specialRequests,
        reservationTables: { create: finalTableIds.map((tid) => ({ tableId: tid })) },
      },
      include: {
        reservationTables: { include: { table: true } },
        customer: true,
        restaurant: true,
      },
    });
  });

  return serializeReservation(updated);
};

export const cancelReservation = async (id: bigint, customerId: bigint) => {
  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, ErrorCodes.RESERVATION_NOT_FOUND, 'Reservation not found');
  if (existing.customerId !== customerId) throw new AppError(403, ErrorCodes.FORBIDDEN, 'Access denied');
  if (existing.status === 'CANCELLED' || existing.status === 'COMPLETED') {
    throw new AppError(409, ErrorCodes.INVALID_STATUS_TRANSITION, 'Cannot cancel this reservation');
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: { reservationTables: { include: { table: true } }, restaurant: true, customer: true },
  });

  return serializeReservation(updated);
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin Actions
// ─────────────────────────────────────────────────────────────────────────────

export const adminCreateReservation = async (adminId: bigint, input: AdminCreateReservationInput) => {
  const { customerId, restaurantId, reservationDate, startTime, guestCount, tableIds, specialRequests } = input;

  // Verify admin owns restaurant
  const restaurant = await prisma.restaurant.findFirst({
    where: { id: BigInt(restaurantId), adminId },
  });
  if (!restaurant) throw new AppError(404, ErrorCodes.RESTAURANT_NOT_FOUND, 'Restaurant not found');

  const date = validateDateAndTime(reservationDate, startTime);
  const endTime = getEndTime(startTime);
  const tableIdsBig = tableIds.map(BigInt);

  // Validate tables exist and are active
  const tables = await prisma.table.findMany({
    where: { id: { in: tableIdsBig }, restaurantId: BigInt(restaurantId), isActive: true },
  });
  if (tables.length !== tableIds.length) {
    throw new AppError(404, ErrorCodes.TABLE_NOT_FOUND, 'One or more tables not found or inactive');
  }

  // Check capacity
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
  if (totalCapacity < guestCount) {
    throw new AppError(409, ErrorCodes.INSUFFICIENT_CAPACITY, `Selected tables only seat ${totalCapacity}, need ${guestCount}`);
  }

  // Check conflicts and bump existing reservations
  const conflictReservations = await prisma.reservation.findMany({
    where: {
      restaurantId: BigInt(restaurantId),
      reservationDate: date,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    include: { reservationTables: true },
  });

  const reservationsToBump: bigint[] = [];
  for (const r of conflictReservations) {
    if (!timesOverlap(r.startTime, r.endTime, startTime, endTime)) continue;
    const overlapsTable = r.reservationTables.some((rt) =>
      tableIdsBig.some((tid) => tid === rt.tableId)
    );
    if (overlapsTable) reservationsToBump.push(r.id);
  }

  const reservation = await prisma.$transaction(async (tx) => {
    // Bump conflicting reservations to PENDING (unassign tables)
    for (const bumpId of reservationsToBump) {
      await tx.reservationTable.deleteMany({ where: { reservationId: bumpId } });
      await tx.reservation.update({ where: { id: bumpId }, data: { status: 'PENDING' } });
    }

    return tx.reservation.create({
      data: {
        customerId: BigInt(customerId),
        restaurantId: BigInt(restaurantId),
        reservationDate: date,
        startTime,
        endTime,
        guestCount,
        specialRequests,
        status: 'CONFIRMED',
        createdBy: 'ADMIN',
        reservationTables: { create: tableIdsBig.map((id) => ({ tableId: id })) },
      },
      include: {
        reservationTables: { include: { table: true } },
        customer: true,
        restaurant: true,
      },
    });
  });

  return {
    reservation: serializeReservation(reservation),
    bumpedCount: reservationsToBump.length,
  };
};

export const adminGetReservations = async (adminId: bigint, query: ListReservationsQuery) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { adminId } });
  if (!restaurant) throw new AppError(404, ErrorCodes.RESTAURANT_NOT_FOUND, 'Restaurant not found');

  const where: any = { restaurantId: restaurant.id };
  if (query.date) where.reservationDate = new Date(query.date);
  if (query.status) where.status = query.status;
  if (query.customerId) where.customerId = BigInt(query.customerId);
  if (query.tableId) {
    where.reservationTables = { some: { tableId: BigInt(query.tableId) } };
  }
  if (query.guestName) {
    where.customer = { name: { contains: query.guestName } };
  }

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      reservationTables: { include: { table: true } },
      customer: true,
      restaurant: true,
    },
    orderBy: [{ reservationDate: 'desc' }, { startTime: 'asc' }],
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  });

  return reservations.map(serializeReservation);
};

export const adminUpdateReservation = async (
  id: bigint,
  adminId: bigint,
  input: AdminUpdateReservationInput
) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { adminId } });
  if (!restaurant) throw new AppError(404, ErrorCodes.RESTAURANT_NOT_FOUND, 'Restaurant not found');

  const existing = await prisma.reservation.findUnique({
    where: { id },
    include: { reservationTables: true },
  });
  if (!existing) throw new AppError(404, ErrorCodes.RESERVATION_NOT_FOUND, 'Reservation not found');
  if (existing.restaurantId !== restaurant.id) throw new AppError(403, ErrorCodes.FORBIDDEN, 'Access denied');
  if (existing.status === 'CANCELLED' || existing.status === 'COMPLETED') {
    throw new AppError(409, ErrorCodes.RESERVATION_NOT_EDITABLE, 'Cannot edit cancelled or completed reservation');
  }

  const newStartTime = input.startTime ?? existing.startTime;
  const newEndTime = getEndTime(newStartTime);
  const newDate = input.reservationDate ? new Date(input.reservationDate) : existing.reservationDate;
  const newGuestCount = input.guestCount ?? existing.guestCount;

  let finalTableIds: bigint[] = existing.reservationTables.map((rt) => rt.tableId);

  if (input.tableIds) {
    const tableIdsBig = input.tableIds.map(BigInt);
    const tables = await prisma.table.findMany({
      where: { id: { in: tableIdsBig }, restaurantId: restaurant.id, isActive: true },
    });
    if (tables.length !== tableIdsBig.length) {
      throw new AppError(404, ErrorCodes.TABLE_NOT_FOUND, 'One or more tables not found');
    }
    const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
    if (totalCapacity < newGuestCount) {
      throw new AppError(409, ErrorCodes.INSUFFICIENT_CAPACITY, `Tables seat ${totalCapacity}, need ${newGuestCount}`);
    }

    // Handle bumping
    const conflictReservations = await prisma.reservation.findMany({
      where: { restaurantId: restaurant.id, reservationDate: newDate, status: { in: ['PENDING', 'CONFIRMED'] }, id: { not: id } },
      include: { reservationTables: true },
    });

    const toBump: bigint[] = [];
    for (const r of conflictReservations) {
      if (!timesOverlap(r.startTime, r.endTime, newStartTime, newEndTime)) continue;
      const overlaps = r.reservationTables.some((rt) => tableIdsBig.includes(rt.tableId));
      if (overlaps) toBump.push(r.id);
    }

    await prisma.$transaction(async (tx) => {
      for (const bumpId of toBump) {
        await tx.reservationTable.deleteMany({ where: { reservationId: bumpId } });
        await tx.reservation.update({ where: { id: bumpId }, data: { status: 'PENDING' } });
      }
    });

    finalTableIds = tableIdsBig;
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.reservationTable.deleteMany({ where: { reservationId: id } });

    return tx.reservation.update({
      where: { id },
      data: {
        customerId: input.customerId ? BigInt(input.customerId) : undefined,
        reservationDate: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
        guestCount: newGuestCount,
        specialRequests: input.specialRequests ?? existing.specialRequests,
        reservationTables: { create: finalTableIds.map((tid) => ({ tableId: tid })) },
      },
      include: {
        reservationTables: { include: { table: true } },
        customer: true,
        restaurant: true,
      },
    });
  });

  return serializeReservation(updated);
};

export const adminUpdateStatus = async (id: bigint, adminId: bigint, input: UpdateStatusInput) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { adminId } });
  if (!restaurant) throw new AppError(404, ErrorCodes.RESTAURANT_NOT_FOUND, 'Restaurant not found');

  const existing = await prisma.reservation.findFirst({ where: { id, restaurantId: restaurant.id } });
  if (!existing) throw new AppError(404, ErrorCodes.RESERVATION_NOT_FOUND, 'Reservation not found');

  // Validate transitions
  const transitions: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['CANCELLED', 'COMPLETED'],
    CANCELLED: [],
    COMPLETED: [],
  };

  if (!transitions[existing.status]?.includes(input.status)) {
    throw new AppError(409, ErrorCodes.INVALID_STATUS_TRANSITION, `Cannot transition from ${existing.status} to ${input.status}`);
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status: input.status },
    include: {
      reservationTables: { include: { table: true } },
      customer: true,
      restaurant: true,
    },
  });

  return serializeReservation(updated);
};

export const adminDeleteReservation = async (id: bigint, adminId: bigint) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { adminId } });
  if (!restaurant) throw new AppError(404, ErrorCodes.RESTAURANT_NOT_FOUND, 'Restaurant not found');

  const existing = await prisma.reservation.findFirst({ where: { id, restaurantId: restaurant.id } });
  if (!existing) throw new AppError(404, ErrorCodes.RESERVATION_NOT_FOUND, 'Reservation not found');

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: { reservationTables: { include: { table: true } }, customer: true, restaurant: true },
  });

  return serializeReservation(updated);
};

export const getAvailability = async (restaurantId: bigint, date: string, guestCount: number) => {
  const reservationDate = new Date(date);
  const { generateTimeSlots, getEndTime: endOf } = await import('../../utils/timeSlots');
  const slots = generateTimeSlots();

  const results = await Promise.all(
    slots.map(async (startTime) => {
      const endTime = endOf(startTime);
      try {
        const tableIds = await autoAssignTables(restaurantId, reservationDate, startTime, endTime, guestCount);
        return { time: startTime, available: true, tableCount: tableIds.length };
      } catch {
        return { time: startTime, available: false, tableCount: 0 };
      }
    })
  );

  return results;
};
