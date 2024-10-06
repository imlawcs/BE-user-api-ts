import { Request, Response, NextFunction } from 'express';
import service from '../service/user.service';

class UserController {
    public async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (id) {
                const user = await service.getUserById(id);
                res.status(200).send(user);
            } else {
                const users = await service.getAllUsers();
                res.status(200).send(users);
            }
        } catch (error) {
            next(error);
        }
    }

    public async getUserByRoleName(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { roleName } = req.params;
            const users = await service.getUserByRoleName(roleName);
            res.status(200).send(users);
        } catch (error) {
            next(error);
        }
    }

    // public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const user = req.body;
    //         const createStatus = await service.createUser(user);
    //         res.status(201).send(createStatus);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = req.body;
            const updateStatus = await service.updateUser(id, user);
            res.status(200).send(updateStatus);
        } catch (error) {
            next(error);
        }
    }

    public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deleteStatus = await service.deleteUser(id);
            res.status(200).send(deleteStatus);
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
