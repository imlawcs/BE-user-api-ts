import {StatusCodes} from 'http-status-codes';
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/customError';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

class ValidateMiddleware {
    async validateRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await registerSchema.validateAsync(req.body, { abortEarly: false });
            req.body.role = (req.body.role === "admin" ? 1 : 2);

            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateLogin(req: Request, res: Response, next: NextFunction) {
        try {
            await loginSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }
}

export default new ValidateMiddleware()