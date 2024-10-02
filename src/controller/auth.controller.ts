import { Request, Response, NextFunction } from "express";
import mailService from "../middleware/mailService.js";
import userServices from "../service/auth.service";
import authSchemas from "../schemas/authSchemas";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";

require("dotenv").config();

class AuthController {
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = req.body;
        try {
            const { error } = authSchemas.registerSchema.validate(user);
            if (error) {
                throw new ApiError(400, error.details[0].message);
            }
            const registerStatus = await userServices.register(user);
            res.status(201).send(registerStatus);
        } catch (error) {
            next(error);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = req.body;
        try {
            const { error } = authSchemas.loginSchema.validate(user);
            if (error) {
                throw new ApiError(400, error.details[0].message);
            }
            const loginStatus = await userServices.login(user);
            res.status(200).send(loginStatus);
        } catch (error) {
            next(error);
        }
    }

    public async getMail(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email } = req.body;
        try {
            const getMailStatus = await userServices.getMail(email);
            res.status(200).json({
                status: 200,
                message: "Email found",
            });
        } catch (error) {
            next(error);
        }
    }

    public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;
            await this.getMail(req, res, next);

            const forgotStatus = await userServices.forgotPassword(email);
            res.status(200).send(forgotStatus);
        } catch (error) {
            next(error);
        }
    }

    public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, passwordResetToken, newPassword } = req.body;
            const isValidUser = await userServices.isValidUser(email, passwordResetToken);

            const updateStatus = await userServices.resetPassword(email, newPassword);
            if (updateStatus.status === 200) {
                res.status(200).json({
                    message: "Reset password successfully",
                });
            }
        } catch (error) {
            next(error);
        }
    }
}

const authController = new AuthController();
export default authController;
