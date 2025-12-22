import express, { Request, Response } from 'express';
import {
  registerUser,
  logInUser,
  refreshAccessToken,
  handleLogout,
  handleOAuthCallback,
  initiateOAuthFlow,
} from '../services/AuthService';
import { SignUpDto } from '../DTO/SignUpDTO';
import { LogInDTO } from '../DTO/LogInDTO';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';
import prisma from '../db/prismaClient';
//import { GoogleTokenResponse, GoogleUserInfo } from '../types/GoogleResponse';

const router = express.Router();

//const ACCESS_TOKEN_EXPIRY = parseInt(process.env.ACCESS_TOKEN_EXPIRY || '180', 10); // 3 minutes default
//const REFRESH_TOKEN_EXPIRY = parseInt(process.env.REFRESH_TOKEN_EXPIRY || '600', 10); // 10 minutes default

router.post('/internal/auth/register', async (req: Request, res: Response) => {
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
});

router.get('/internal/auth/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true },
    });

    return res.status(200).json({
      success: true,
      message: 'User list for verification',
      count: users.length,
      users,
    });
  } catch (err) {
    logger.error('Fetch users error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.post('/internal/auth/login', async (req: Request, res: Response) => {
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
});

router.post('/internal/auth/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const result = await refreshAccessToken(refreshToken);

    return res.status(result.status || 500).json({
      success: result.success,
      message: result.message,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    logger.error('Token refresh controller error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

router.post(
  '/internal/auth/logout',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    const userId = req.userId;

    if (!refreshToken || !userId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required logout data' });
    }

    try {
      const result = await handleLogout(userId, refreshToken, accessToken);
      return res.status(result.status).json(result);
    } catch (err) {
      logger.error('Logout route error:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
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

router.get('/auth/google', async (req: Request, res: Response) => {
  try {
    const redirectUrl = await initiateOAuthFlow();
    //logger.info(redirectUrl);
    return res.redirect(redirectUrl);
  } catch (err) {
    logger.error('OAuth Init Error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

router.get('/auth/google/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code)
    return res.status(400).json({ success: false, message: 'Code missing' });

  try {
    const result = await handleOAuthCallback(code);
    return res.status(result.status || 200).json(result);
  } catch (err) {
    logger.error('Google Callback Error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Authentication failed' });
  }
});

export default router;
