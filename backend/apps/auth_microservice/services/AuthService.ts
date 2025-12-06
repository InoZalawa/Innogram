import bcrypt from 'bcrypt';

import * as env from 'dotenv';

import jwt from 'jsonwebtoken';

import { SignUpDto } from '../DTO/SignUpDTO';

import { LogInDTO } from '../DTO/LogInDTO';

import prisma from '../db/prismaClient';

//import { Prisma } from '@prisma/client';

env.config();

export const registerUser = async (signUpDto: SignUpDto) => {
  let result = {
    success: false,
    status: 500,
    message: 'INTERNAL SERVER ERROR',
  };

  if (signUpDto.password !== signUpDto.repeatPassword) {
    console.log('PASSWORDS ARENT MATCHING');
    return {
      success: false,
      status: 400,
      message: 'PASSWORDS ARE NOT THE SAME',
    };
  }

  try {
    await prisma.$transaction(async (tx: any) => {
      const encryptedPassword = await bcrypt.hash(signUpDto.password, 12);

      const isUserUnique = await tx.user.findFirst({
        where: {
          OR: [{ email: signUpDto.email }, { username: signUpDto.username }],
        },
      });

      if (!isUserUnique) {
        await tx.user.create({
          data: {
            username: signUpDto.username,
            password: encryptedPassword,
            email: signUpDto.email,
          },
        });

        console.log('NEW USER REGISTERED');
        result = { success: true, status: 201, message: 'SUCCESS' };
      } else {
        console.log('USER ALREADY EXISTS');
        result = { success: false, status: 409, message: 'USER IS NOT UNIQUE' };
      }
    });
  } catch (err) {
    console.error('REGISTRATION ERROR:', err);
    result = { success: false, status: 500, message: 'DB ERROR' };
  } finally {
    return result;
  }
};

export const logInUser = async (logInDto: LogInDTO) => {
  const TOKEN_KEY = process.env.JWT_KEY;
  if (!TOKEN_KEY) {
    throw new Error('wrong JWT KEY');
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: logInDto.login }, { email: logInDto.login }],
      },
    });

    if (!user) {
      return { success: false, status: 401, message: 'WRONG LOGIN/PASSWORD' };
    }

    const arePasswordsMatching = await bcrypt.compare(
      logInDto.password,
      user.password
    );

    if (arePasswordsMatching) {
      const tokenPayload = {
        userId: user.id,
        sub: user.email,
      };

      const accessOptions = {
        issuer: 'innogram-auth-service',
        expiresIn: 60 * 3, // 3 minutes
      };
      const accessToken = jwt.sign(tokenPayload, TOKEN_KEY, accessOptions);

      const refreshOptions = {
        issuer: 'innogram-auth-service',
        expiresIn: 60 * 10, // 10 minutes
      };
      const refreshToken = jwt.sign(tokenPayload, TOKEN_KEY, refreshOptions);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
        },
      });

      return {
        success: true,
        status: 200,
        message: 'SUCCESS: USER LOGGED IN',
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } else {
      return { success: false, status: 401, message: 'WRONG LOGIN/PASSWORD' };
    }
  } catch (err) {
    console.error('LOG IN ERROR:', err);
    return { success: false, status: 500, message: 'DB ERROR' };
  }
};
