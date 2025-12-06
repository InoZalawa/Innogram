import { body, ValidationChain } from 'express-validator';

export const validateEmail = (): ValidationChain => {
  return body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .trim();
};

export const validatePassword = (): ValidationChain => {
  return body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');
};

export const validateUsername = (): ValidationChain => {
  return body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .trim();
};

export const validateLogin = (): ValidationChain => {
  return body('login')
    .notEmpty()
    .withMessage('Login field is required')
    .trim();
};

export const registerValidation = [
  validateUsername(),
  validateEmail(),
  validatePassword(),
  body('repeatPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

export const loginValidation = [
  validateLogin(),
  body('password').notEmpty().withMessage('Password is required'),
];
