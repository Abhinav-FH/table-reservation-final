import { prisma } from '../../config/prisma';
import { AppError, ErrorCodes } from '../../utils/errors';
import { CreateTableInput, UpdateTableInput } from './table.schema';

const MAX_TABLES = 10;

export const getAdminRestaurantId = async (adminId: bigint): Promise<bigint> => {
  const restaurant = await prisma.restaurant.findUnique({ where: { adminId } });
  if (!restaurant) throw new AppError(404, ErrorCodes.RESTAURANT_NOT_FOUND, 'Create a restaurant first');
  return restaurant.id;
};

export const createTable = async (adminId: bigint, input: CreateTableInput) => {
  const restaurantId = await getAdminRestaurantId(adminId);
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });

  // Validate grid bounds
  if (input.gridRow >= restaurant!.gridRows || input.gridCol >= restaurant!.gridCols) {
    throw new AppError(400, ErrorCodes.INVALID_CAPACITY, `Cell out of grid bounds (${restaurant!.gridRows}x${restaurant!.gridCols})`);
  }

  // Max tables check
  const count = await prisma.table.count({ where: { restaurantId } });
  if (count >= MAX_TABLES) throw new AppError(409, ErrorCodes.MAX_TABLES_REACHED, 'Maximum 10 tables per restaurant');

  const table = await prisma.table.create({
    data: { restaurantId, ...input },
  });

  return serializeTable(table);
};

export const listTables = async (adminId: bigint) => {
  const restaurantId = await getAdminRestaurantId(adminId);
  const tables = await prisma.table.findMany({
    where: { restaurantId },
    orderBy: [{ gridRow: 'asc' }, { gridCol: 'asc' }],
  });
  return tables.map(serializeTable);
};

export const updateTable = async (adminId: bigint, tableId: bigint, input: UpdateTableInput) => {
  const restaurantId = await getAdminRestaurantId(adminId);
  const table = await prisma.table.findFirst({ where: { id: tableId, restaurantId } });
  if (!table) throw new AppError(404, ErrorCodes.TABLE_NOT_FOUND, 'Table not found');

  const updated = await prisma.table.update({
    where: { id: tableId },
    data: input,
  });

  return serializeTable(updated);
};

export const deleteTable = async (adminId: bigint, tableId: bigint) => {
  const restaurantId = await getAdminRestaurantId(adminId);
  const table = await prisma.table.findFirst({ where: { id: tableId, restaurantId } });
  if (!table) throw new AppError(404, ErrorCodes.TABLE_NOT_FOUND, 'Table not found');

  // Check active reservations
  const activeReservations = await prisma.reservationTable.count({
    where: {
      tableId,
      reservation: { status: { in: ['PENDING', 'CONFIRMED'] } },
    },
  });

  if (activeReservations > 0) {
    // Deactivate instead of delete
    const updated = await prisma.table.update({ where: { id: tableId }, data: { isActive: false } });
    return serializeTable(updated);
  }

  await prisma.table.delete({ where: { id: tableId } });
  return { deleted: true };
};

export const getFloorPlan = async (adminId: bigint, date?: string) => {
  const restaurantId = await getAdminRestaurantId(adminId);
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId }, include: { tables: true } });

  if (!restaurant) throw new AppError(404, ErrorCodes.RESTAURANT_NOT_FOUND, 'Restaurant not found');

  let bookedTableIds: Set<string> = new Set();

  if (date) {
    const reservationDate = new Date(date);
    const reservations = await prisma.reservation.findMany({
      where: {
        restaurantId,
        reservationDate,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      include: { reservationTables: true },
    });

    for (const r of reservations) {
      for (const rt of r.reservationTables) {
        bookedTableIds.add(String(rt.tableId));
      }
    }
  }

  const grid: Array<Array<any>> = Array.from({ length: restaurant.gridRows }, () =>
    Array(restaurant.gridCols).fill(null)
  );

  for (const table of restaurant.tables) {
    const status = !table.isActive
      ? 'DISABLED'
      : bookedTableIds.has(String(table.id))
        ? 'BOOKED'
        : 'AVAILABLE';

    grid[table.gridRow][table.gridCol] = {
      ...serializeTable(table),
      status,
    };
  }

  return {
    restaurantId: String(restaurantId),
    gridRows: restaurant.gridRows,
    gridCols: restaurant.gridCols,
    grid,
  };
};

const serializeTable = (t: any) => ({
  ...t,
  id: String(t.id),
  restaurantId: String(t.restaurantId),
});
