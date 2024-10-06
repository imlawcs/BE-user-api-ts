import { Request, Response, NextFunction } from 'express';
import service from '../service/role.service';

class RoleController {
    public async getRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (id) {
                const role = await service.getRoleById(id);
                res.status(200).send(role);
            } else {
                const roles = await service.getAllRoles();
                res.status(200).send(roles);
            }
        } catch (error) {
            next(error);
        }
    }

    // public async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const role = req.body;
    //         const createStatus = await service.createRole(role);
    //         res.status(201).send(createStatus);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // public async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const { id } = req.params;
    //         const role = req.body;
    //         const updateStatus = await service.updateRole(id, role);
    //         res.status(200).send(updateStatus);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // public async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const { id } = req.params;
    //         const deleteStatus = await service.deleteRole(id);
    //         res.status(200).send(deleteStatus);
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}

const roleController = new RoleController();

export default roleController;
