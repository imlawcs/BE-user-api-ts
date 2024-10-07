import express from "express";
import userControllers from '../controller/auth.controller'; 
import validateMiddleware from '../middleware/validate.middleware';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.post("/register", validateMiddleware.validateRegister, userControllers.register);
router.post("/login", validateMiddleware.validateLogin, userControllers.login);
router.get("/me", authMiddleware.authenticateToken, userControllers.getMe);

export default router;
