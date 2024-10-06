import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.router';
import roleRouter from './routes/role.router';
import authRouter from './routes/auth.router';
import errorHandler from './middleware/errorHandler';
import { ErrorRequestHandler } from 'express';
import customError from './utils/customError';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api', userRouter);
app.use('/api', roleRouter);
app.use('/api', authRouter);

// Test error route
app.get('/error', (req: Request, res: Response, next: NextFunction) => {
  next(new customError(500, 'Test error'));
});

// app.use(errorHandler as ErrorRequestHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
