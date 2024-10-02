import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import db from '../database/connection';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;

class AuthMiddleware {
    async authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token == null) {
                res.status(401).send({ message: 'Unauthorized: No token provided' });
                return;
            }
            const decode = jwt.verify(token, jwtSecret);
            if (!decode) {
                res.status(403).send({ message: 'Forbidden: Invalid token' });
                return;
            }
            next();
        } catch (error) {
           res.status(400).send('Token is invalid');
           return;
        }
    }

    authorize(allowedRoleId: number[]) {
        return (req: Request, res: Response, next: NextFunction): void => {
            try {
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];

                if (!token) {
                   res.status(401).json({ message: 'Unauthorized: No token provided' });
                   return; 
                }

                const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

                const roleId = decoded.role[0].roleId;
                if (!allowedRoleId.includes(roleId)) {
                    res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
                    return;
                }

                next();
            } catch (error) {
                res.status(400).json({ message: 'Token is invalid' });
                return;
            }
        };
    }
}

const authMiddleware = new AuthMiddleware();

export default authMiddleware;
