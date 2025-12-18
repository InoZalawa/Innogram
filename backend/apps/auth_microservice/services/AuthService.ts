import bcrypt from 'bcrypt';
import * as env from 'dotenv';
import jwt from 'jsonwebtoken';
import { SignUpDto } from '../DTO/SignUpDTO';
import { LogInDTO } from '../DTO/LogInDTO';
import prisma from '../db/prismaClient';
import logger from '../utils/logger';
import RedisAuth from '../DTO/RedisRepository';
import axios from 'axios';
import { GoogleUserInfo, GoogleTokenResponse } from '../types/GoogleResponse';

env.config();

const JWT_KEY = process.env.JWT_KEY;
if (!JWT_KEY) {
  throw new Error('JWT_KEY environment variable is not set');
}

const ACCESS_TOKEN_EXPIRY = parseInt(
  process.env.ACCESS_TOKEN_EXPIRY || '180',
  10
); // 3 minutes default
const REFRESH_TOKEN_EXPIRY = parseInt(
  process.env.REFRESH_TOKEN_EXPIRY || '600',
  10
); // 10 minutes default

export const registerUser = async (signUpDto: SignUpDto) => {
  try {
    // Validate password match
    if (signUpDto.password !== signUpDto.repeatPassword) {
      logger.warn('Registration failed: passwords do not match');
      return {
        success: false,
        status: 400,
        message: 'Passwords do not match',
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      const encryptedPassword = await bcrypt.hash(signUpDto.password, 12);

      // Check if user already exists
      const existingUser = await tx.user.findFirst({
        where: {
          OR: [{ email: signUpDto.email }, { username: signUpDto.username }],
        },
      });

      if (existingUser) {
        logger.warn(
          `Registration failed: user already exists - ${signUpDto.email}`
        );
        return {
          success: false,
          status: 409,
          message: 'User with this email or username already exists',
        };
      }

      // Create new user
      await tx.user.create({
        data: {
          username: signUpDto.username,
          password: encryptedPassword,
          email: signUpDto.email,
        },
      });

      logger.info(`New user registered: ${signUpDto.email}`);
      return {
        success: true,
        status: 201,
        message: 'User registered successfully',
      };
    });

    return result;
  } catch (err) {
    logger.error('Registration error:', err);
    return {
      success: false,
      status: 500,
      message: 'Registration failed. Please try again later.',
    };
  }
};

export const logInUser = async (logInDto: LogInDTO) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: logInDto.login }, { email: logInDto.login }],
    },
  });

  if (!user || !(await bcrypt.compare(logInDto.password, user.password))) {
    return {
      success: false,
      status: 401,
      message: 'Invalid email or password',
    };
  }

  const tokenPayload = { userId: user.id, sub: user.email };
  const accessToken = jwt.sign(tokenPayload, JWT_KEY!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign(tokenPayload, JWT_KEY!, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  try {
    await RedisAuth.storeRefreshTokenId(user.id.toString(), refreshToken);
  } catch (err) {
    logger.error('Failed to store session in Redis:', err);
  }

  return {
    success: true,
    status: 200,
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, username: user.username },
  };
};

export const refreshAccessToken = async (oldRefreshToken: string) => {
  try {
    const decoded = jwt.verify(oldRefreshToken, JWT_KEY!) as {
      userId: number;
      sub: string;
    };

    const userIdFromRedis = await RedisAuth.findSessionByTokenId(
      oldRefreshToken
    );
    if (!userIdFromRedis || userIdFromRedis !== decoded.userId.toString()) {
      return {
        success: false,
        status: 401,
        message: 'Session expired or invalid',
      };
    }

    const tokenPayload = { userId: decoded.userId, sub: decoded.sub };
    const newAccessToken = jwt.sign(tokenPayload, JWT_KEY!, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const newRefreshToken = jwt.sign(tokenPayload, JWT_KEY!, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    await RedisAuth.storeRefreshTokenId(
      decoded.userId.toString(),
      newRefreshToken
    );

    await RedisAuth.blacklistToken(oldRefreshToken, 30);

    return {
      success: true,
      status: 200,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    return {
      success: false,
      status: 401,
      message: 'Invalid refresh token' + err,
    };
  }
};
export const handleLogout = async (
  userId: number,
  refreshToken: string,
  accessToken?: string
) => {
  try {
    await RedisAuth.findSessionByTokenId(refreshToken);

    if (accessToken) {
      await RedisAuth.blacklistToken(accessToken, ACCESS_TOKEN_EXPIRY);
    }

    return { success: true, status: 200, message: 'Logged out successfully' };
  } catch (err) {
    logger.error('Logout error:', err);
    return { success: false, status: 500, message: 'Internal server error' };
  }
};

export const validateToken = async (accessToken: string) => {
  try {
    const decoded = jwt.verify(accessToken, JWT_KEY!);

    const isBlacklisted = await RedisAuth.isTokenBlacklisted(accessToken);

    if (isBlacklisted) {
      return {
        success: false,
        code: 401,
        message: 'Token has been invalidated (logged out)',
      };
    }

    return { success: true, code: 200, decoded };
  } catch (err) {
    return { success: false, code: 401, error: err };
  }
};

export const exchangeCodeForTokens = async (
  code: string
): Promise<GoogleUserInfo> => {
  const tokenResponse = await axios.post<GoogleTokenResponse>(
    'https://oauth2.googleapis.com/token',
    {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }
  );

  const { access_token } = tokenResponse.data;

  const userResponse = await axios.get(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );

  return userResponse.data as GoogleUserInfo;
};

export const handleGoogleAuth = async (googleProfile: {
  id: string;
  gmail: string;
}) => {
  googleProfile.gmail = googleProfile.gmail.toLowerCase();
  try {
    let user = await prisma.user.findUnique({
      where: { email: googleProfile.gmail },
    });

    if (!user) {
      const newRandomPassword = await bcrypt.hash(Math.random().toString(), 12);
      user = await prisma.user.create({
        data: {
          email: googleProfile.gmail,
          password: newRandomPassword,
          username:
            googleProfile.gmail.split('@')[0] +
            '_' +
            googleProfile.id.slice(0, 6),
        },
      });
      logger.info(`New user registered via Google: ${user.email}`);
    }

    const tokenPayload = { userId: user.id, sub: user.email };
    const accessToken = jwt.sign(tokenPayload, JWT_KEY, {
      issuer: 'innogram-auth-service',
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(tokenPayload, JWT_KEY, {
      issuer: 'innogram-auth-service',
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    try {
      await RedisAuth.storeRefreshTokenId(user.id.toString(), refreshToken);
    } catch (redisErr) {
      logger.error('Redis session storage failed', redisErr);
    }

    return {
      success: true,
      status: 200,
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, username: user.username },
    };
  } catch (err) {
    logger.error('Google auth error:', err);
    throw err;
  }
};

export const handleOAuthCallback = async (code: string) => {
  const googleProfile = await exchangeCodeForTokens(code);
  return await handleGoogleAuth({
    id: googleProfile.id,
    gmail: googleProfile.email,
  });
};

export const handleOAuthInit = async () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
  };
  //logger.info(`${rootUrl}?${new URLSearchParams(options).toString()}`)
  return `${rootUrl}?${new URLSearchParams(options).toString()}`;
};
