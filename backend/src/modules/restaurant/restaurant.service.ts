import { prisma } from '../../config/prisma';
import { AppError, ErrorCodes } from '../../utils/errors';
import { CreateRestaurantInput, UpdateRestaurantInput } from './restaurant.schema';

export const createRestaurant = async (adminId: bigint, input: CreateRestaurantInput) => {
  const existing = await prisma.restaurant.findUnique({ where: { adminId } });
  if (existing) throw new AppError(409, ErrorCodes.RESTAURANT_ALREADY_EXISTS, 'You already have a restaurant');

  const restaurant = await prisma.restaurant.create({
    data: { adminId, ...input },
  });

  return serializeRestaurant(restaurant);
};

export const getRestaurantByAdmin = async (adminId: bigint) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { adminId },
    include: { tables: { orderBy: [{ gridRow: 'asc' }, { gridCol: 'asc' }] } },
  });

  if (!restaurant) throw new AppError(404, ErrorCodes.RESTAURANT_NOT_FOUND, 'Restaurant not found');
  return serializeRestaurant(restaurant);
};

export const getRestaurant = async (restaurantId: bigint) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: { tables: { where: { isActive: true }, orderBy: [{ gridRow: 'asc' }, { gridCol: 'asc' }] } },
  });

  if (!restaurant) throw new AppError(404, ErrorCodes.RESTAURANT_NOT_FOUND, 'Restaurant not found');
  return serializeRestaurant(restaurant);
};

export const listRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany({
    include: { tables: { where: { isActive: true } } },
  });
  return restaurants.map(serializeRestaurant);
};

export const updateRestaurant = async (adminId: bigint, input: UpdateRestaurantInput) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { adminId } });
  if (!restaurant) throw new AppError(404, ErrorCodes.RESTAURANT_NOT_FOUND, 'Restaurant not found');

  const updated = await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: input,
  });

  return serializeRestaurant(updated);
};

const serializeRestaurant = (r: any) => ({
  ...r,
  id: String(r.id),
  adminId: String(r.adminId),
  tables: r.tables?.map((t: any) => ({
    ...t,
    id: String(t.id),
    restaurantId: String(t.restaurantId),
  })),
});
