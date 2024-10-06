import { Request, Response, NextFunction } from "express";
import userServices from "../service/auth.service";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import customError from "../utils/customError";

require("dotenv").config();

class AuthController {
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { username, password, email, fullname, role } = req.body;
        const user = { username, password, email, fullname, role };
        try {
            const registerStatus = await userServices.register(user);
            res.status(201).send(registerStatus);
        } catch (error) {
            next(error);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = req.body;
        try {
            const loginStatus = await userServices.login(user);
            res.status(200).send(loginStatus);
        } catch (error) {
            next(error);
        }
    }
}

const authController = new AuthController();
export default authController;
