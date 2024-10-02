import express, { Request, Response, NextFunction } from 'express';
import controller from '../controller/role.controller';
import auth from '../middleware/auth.middleware';

const router = express.Router();

router.get('/roles/:id?', controller.getRoles);
router.post('/roles', auth.authenticateToken, controller.createRole);
router.put('/roles/:id', auth.authenticateToken, controller.updateRole);
router.delete('/roles/:id', auth.authenticateToken, controller.deleteRole);

export default router;