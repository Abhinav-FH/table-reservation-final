
// Patch BigInt serialization globally — must be before any imports that use Express
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
import express from 'express';
import cors from 'cors';
import './config/env'; // Validate env on startup

import authRoutes from './modules/auth/auth.routes';
import restaurantRoutes from './modules/restaurant/restaurant.routes';
import tableRoutes from './modules/table/table.routes';
import reservationRoutes from './modules/reservation/reservation.routes';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/admin/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);

// Global error handler — must be last
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
});

export default app;
