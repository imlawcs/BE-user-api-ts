import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    if (err.statusCode || err.message) {
        const { statusCode, message } = err;
        return res.status(statusCode || 400).json({ message: message || 'Bad request' });
    } else {
        res.status(500).send({ message: 'Internal server error' });
    }
    next(err);
};

export default errorHandler;


