import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import AuthController from './controllers/AuthController';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';

// import { cleanupExpiredTokens } from './services/AuthService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging with response status
app.use((req: Request, res: Response, next) => {
  const startTime = Date.now();

  // Log request
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor =
      res.statusCode >= 400 ? 'error' : res.statusCode >= 300 ? 'warn' : 'info';
    logger[statusColor](`${req.method} ${req.path} ${res.statusCode}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
});

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Auth microservice is running 123',
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
    // await cleanupExpiredTokens();
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
