import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import kiranasRoutes from './routes/kiranas.routes.js';
import productsRoutes from './routes/products.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = [process.env.ALLOWED_ORIGIN].filter(Boolean);
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173');
}

app.use(
  cors({
    origin(origin, callback) {
      // no Origin header (curl, server-to-server, health checks) — allow
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
  })
);

app.use(express.json());
app.use(morgan(':method :url :status - :response-time ms'));

// No DB dependency — Render's health check must succeed even if the DB is briefly unreachable.
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/kiranas', kiranasRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`zippd server listening on port ${PORT}`);
});
