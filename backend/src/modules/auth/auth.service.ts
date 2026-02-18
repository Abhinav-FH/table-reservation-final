import { prisma } from '../../config/prisma';
import { hashPassword, comparePassword, hashToken } from '../../utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AppError, ErrorCodes } from '../../utils/errors';
import { RegisterInput, LoginInput, RefreshInput, LogoutInput } from './auth.schema';

const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const register = async (input: RegisterInput) => {
  const { name, email, password, phone, role } = input;

  if (role === 'customer') {
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) throw new AppError(409, ErrorCodes.EMAIL_EXISTS, 'Email already registered');

    const customer = await prisma.customer.create({
      data: { name, email, passwordHash: await hashPassword(password), phone },
    });

    const payload = { sub: String(customer.id), role: 'customer' as const, customerId: String(customer.id) };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: customer.id,
        userType: 'CUSTOMER',
        expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
      },
    });

    return { accessToken, refreshToken, user: { id: String(customer.id), name: customer.name, email: customer.email, role: 'customer' } };
  }

  // Admin
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) throw new AppError(409, ErrorCodes.EMAIL_EXISTS, 'Email already registered');

  const admin = await prisma.admin.create({
    data: { name, email, passwordHash: await hashPassword(password) },
  });

  const payload = { sub: String(admin.id), role: 'admin' as const, adminId: String(admin.id) };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: admin.id,
      userType: 'ADMIN',
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
    },
  });

  return { accessToken, refreshToken, user: { id: String(admin.id), name: admin.name, email: admin.email, role: 'admin' } };
};

export const login = async (input: LoginInput) => {
  const { email, password, role } = input;

  if (role === 'customer') {
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) throw new AppError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password');

    const valid = await comparePassword(password, customer.passwordHash);
    if (!valid) throw new AppError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password');

    const payload = { sub: String(customer.id), role: 'customer' as const, customerId: String(customer.id) };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: customer.id,
        userType: 'CUSTOMER',
        expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
      },
    });

    return { accessToken, refreshToken, user: { id: String(customer.id), name: customer.name, email: customer.email, role: 'customer', phone: customer.phone } };
  }

  // Admin
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new AppError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password');

  const valid = await comparePassword(password, admin.passwordHash);
  if (!valid) throw new AppError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password');

  const payload = { sub: String(admin.id), role: 'admin' as const, adminId: String(admin.id) };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: admin.id,
      userType: 'ADMIN',
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
    },
  });

  return { accessToken, refreshToken, user: { id: String(admin.id), name: admin.name, email: admin.email, role: 'admin' } };
};

export const refresh = async (input: RefreshInput) => {
  const { refreshToken } = input;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, ErrorCodes.TOKEN_EXPIRED, 'Refresh token invalid or expired');
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError(401, ErrorCodes.TOKEN_EXPIRED, 'Refresh token not found or expired');
  }

  // Rotate: delete old, issue new
  await prisma.refreshToken.delete({ where: { tokenHash } });

  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(newRefreshToken),
      userId: stored.userId,
      userType: stored.userType,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logout = async (input: LogoutInput) => {
  const tokenHash = hashToken(input.refreshToken);
  await prisma.refreshToken.deleteMany({ where: { tokenHash } });
};
