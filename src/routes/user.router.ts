import express, { Request, Response, NextFunction } from 'express';
import controller from '../controller/user.controller';
import auth from '../middleware/auth.middleware';

const router = express.Router();

router.get('/users/:id?', auth.authenticateToken, auth.authorize([1]), controller.getUsers);
router.get('/users/role/:roleName', auth.authenticateToken, controller.getUserByRoleName);
router.put('/users/:id?', auth.authenticateToken, controller.updateUser);
router.delete('/users/:id?', auth.authenticateToken, controller.deleteUser);

export default router;