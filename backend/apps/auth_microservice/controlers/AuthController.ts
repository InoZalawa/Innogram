import express, { Request, Response } from 'express';

import { registerUser, logInUser } from '../services/AuthService';

import { SignUpDto } from '../DTO/SignUpDTO';

import { LogInDTO } from '../DTO/LogInDTO';

const router = express.Router();

router.post('/internal/auth/register', async (req: Request, res: Response) => {
  const { username, password, repeatPassword, email } = req.body;

  try {
    const signUpDto = new SignUpDto(username, password, repeatPassword, email);

    const result = await registerUser(signUpDto);

    console.table(result);

    return res.status(result.status || 500).json({
      success: result.success,
      message: result.message,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: 'INTERNAL SERVER ERROR' });
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
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: 'INTERNAL SERVER ERROR' });
  }
});
export default router;
