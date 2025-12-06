import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import AuthController from './controllers/AuthController';
import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler';
import { generalRateLimiter } from './middleware/rateLimiter';
import logger from './utils/logger';
import { cleanupExpiredTokens } from './services/AuthService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(generalRateLimiter);

// Request logging
app.use((req: Request, res: Response, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Auth microservice is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use(AuthController);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Cleanup expired tokens every hour
setInterval(async () => {
  try {
    await cleanupExpiredTokens();
  } catch (err) {
    logger.error('Error cleaning up expired tokens:', err);
  }
}, 60 * 60 * 1000); // 1 hour

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
