import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import searchRoutes from './routes/search.routes';
import { env } from './config';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generalLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/search', searchRoutes);

app.use(errorHandler);

export default app;
