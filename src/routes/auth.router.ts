import express from "express";
import userControllers from '../controller/auth.controller'; 

const router = express.Router();

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.post("/forgot-password", userControllers.forgotPassword);
router.post("/reset-password", userControllers.resetPassword);

export default router;
