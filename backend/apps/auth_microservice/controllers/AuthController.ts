import express, { Request, Response } from 'express';
import {
  registerUser,
  logInUser,
  refreshAccessToken,
  logoutUser,
} from '../services/AuthService';
import { SignUpDto } from '../DTO/SignUpDTO';
import { LogInDTO } from '../DTO/LogInDTO';
import {
  registerValidation,
  loginValidation,
} from '../utils/validation';
import { validationErrorHandler } from '../middleware/errorHandler';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import logger from '../utils/logger';

const router = express.Router();

router.post(
  '/internal/auth/register',
  authRateLimiter,
  registerValidation,
  validationErrorHandler,
  async (req: Request, res: Response) => {
    const { username, password, repeatPassword, email } = req.body;

    try {
      const signUpDto = new SignUpDto(username, password, repeatPassword, email);
      const result = await registerUser(signUpDto);

      return res.status(result.status || 500).json({
        success: result.success,
        message: result.message,
      });
    } catch (err) {
      logger.error('Registration controller error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

router.post(
  '/internal/auth/login',
  authRateLimiter,
  loginValidation,
  validationErrorHandler,
  async (req: Request, res: Response) => {
    const { login, password } = req.body;

    try {
      const logInDTO = new LogInDTO(login, password);
      const result = await logInUser(logInDTO);

      return res.status(result.status || 500).json({
        success: result.success,
        message: result.message,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (err) {
      logger.error('Login controller error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

router.post(
  '/internal/auth/refresh',
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    try {
      const result = await refreshAccessToken(refreshToken);
      return res.status(result.status || 500).json({
        success: result.success,
        message: result.message,
        accessToken: result.accessToken,
      });
    } catch (err) {
      logger.error('Token refresh controller error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

router.post(
  '/internal/auth/logout',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    try {
      const result = await logoutUser(refreshToken, accessToken);
      return res.status(result.status || 500).json({
        success: result.success,
        message: result.message,
      });
    } catch (err) {
      logger.error('Logout controller error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

router.get(
  '/internal/auth/me',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      return res.status(200).json({
        success: true,
        data: {
          userId: req.userId,
          email: req.userEmail,
        },
      });
    } catch (err) {
      logger.error('Get user info error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

export default router;
