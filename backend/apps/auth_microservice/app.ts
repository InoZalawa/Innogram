import express, { Request, Response } from 'express';

import * as dotenv from 'dotenv';

import AuthController from './controlers/AuthController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(AuthController);

app.get('/', (req: Request, res: Response) => {
  res.send('Working!');
});

app.listen(PORT, () => {
  console.log(`Operating on: http://localhost:${PORT}`);
});
