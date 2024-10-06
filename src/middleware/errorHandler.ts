import { Request, Response, NextFunction } from 'express';
import customError from '../utils/customError';
import { ErrorRequestHandler } from 'express';

const errorHandler : ErrorRequestHandler = async (err: customError, req: Request, res: Response, next: NextFunction) => {
    if (err.statusCode || err.message) {
        const { statusCode, message } = err;
        res.status(statusCode || 400).json({ message: message || 'Bad request' });
    } else {
        res.status(500).send({ message: 'Internal server error' });
    }
    next(err);
};

export default errorHandler;


