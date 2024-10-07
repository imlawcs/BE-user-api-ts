import { JwtPayload } from "jsonwebtoken";
import { IPayload } from "../user.interface";
import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            user: Record<string, any>;
        }
    }
}