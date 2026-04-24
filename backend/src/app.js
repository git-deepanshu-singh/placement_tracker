import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
import { getAllowedOrigins } from './utils/env.js';

const app = express();
const allowedOrigins = getAllowedOrigins();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Placement Tracker API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
