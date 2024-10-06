import db from '../database/connection';
import customError from '../utils/customError';
import Role from '../types/role.interface';

class RoleService {
    async getAllRoles(): Promise<Role[]> {
        try {
            const roles: any = await db.query('SELECT * FROM roles');
            if (roles[0].length === 0) {
                throw new customError(404, 'No roles found');
            }
            return roles[0];
        } catch (error) {
            throw error;
        }
    }

    async getRoleById(id: string): Promise<Role[]> {
        try {
            const role: any = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
            if (role[0].length === 0) {
                throw new customError(404, 'Role not found');
            }
            return role[0];
        } catch (error) {
            throw error;
        }
    }

    // async createRole(role: Role): Promise<{ status: number; message: string }> {
    //     try {
    //         if (!role.rolename) {
    //             throw new customError(400, 'No empty fields');
    //         }
    //         const roleExist: any = await db.query('SELECT * FROM roles WHERE rolename = ?', [role.rolename]);
    //         if (roleExist[0].length > 0) {
    //             throw new customError(409, 'Rolename already exists');
    //         }
    //         await db.query('INSERT INTO roles SET ?', [role]);
    //         return {
    //             status: 201,
    //             message: 'Created',
    //         };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async updateRole(id: string, role: Role): Promise<{ status: number; message: string }> {
    //     try {
    //         if (!id) {
    //             throw new customError(400, 'No id provided');
    //         }
    //         const roleExist: any = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
    //         if (roleExist[0].length === 0) {
    //             throw new customError(404, 'Role not found');
    //         }
    //         const rolenameExist: any = await db.query('SELECT * FROM roles WHERE rolename = ?', [role.rolename]);
    //         if (rolenameExist[0].length > 0) {
    //             throw new customError(409, 'Rolename already exists');
    //         }
    //         if (!role.rolename) {
    //             throw new customError(400, 'No empty fields');
    //         }
    //         await db.query('UPDATE roles SET ? WHERE id = ?', [role, id]);
    //         return {
    //             status: 200,
    //             message: 'Updated',
    //         };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async deleteRole(id: string): Promise<{ status: number; message: string }> {
    //     try {
    //         if (!id) {
    //             throw new customError(400, 'No id provided');
    //         }
    //         const roleExist: any = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
    //         if (roleExist[0].length === 0) {
    //             throw new customError(404, 'Role not found');
    //         }
    //         await db.query('DELETE FROM roles WHERE id = ?', [id]);
    //         return {
    //             status: 200,
    //             message: 'Deleted',
    //         };
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

const roleService = new RoleService();

export default roleService;
