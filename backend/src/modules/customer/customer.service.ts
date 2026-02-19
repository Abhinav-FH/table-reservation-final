import { prisma } from '../../config/prisma';

export const findByPhone = async (phone: string) => {
  return prisma.customer.findFirst({
    where: {
      phone: {
        contains: phone,
        
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });
};
