import db from '../database/connection'; 
import bcrypt from 'bcrypt'; 
import customError from '../utils/customError';
import { IUserToGet , IUserToUpdate } from '../types/user.interface';

class UserService {
    async getAllUsers(): Promise<IUserToGet[]> {
        try {
            const [users]: any = await db.query('SELECT u.id, u.username, u.email, u.fullName, (SELECT r.roleName FROM roles r WHERE r.id = u.roleId) AS role FROM users u');
            if (users.length === 0) {
                throw new customError(404, 'No users found');
            }
            return users;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: string): Promise<IUserToGet> {
        try {
            const [rows] : any = await db.query('SELECT id, username, email, fullName, roleId FROM users WHERE id = ?', [id]);
            if (rows.length === 0) {
                throw new customError(404, 'User not found');
            }
            const user: IUserToGet = {
                id: rows[0].id,
                username: rows[0].username,
                email: rows[0].email,
                fullName: rows[0].fullName,
                role: rows[0].roleId == 1 ? 'admin' : 'user'
            };
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserByRoleName(rolename: string): Promise<IUserToGet[]> {
        try {
            if (!rolename) {
                throw new customError(400, 'No rolename provided');
            }
            if (rolename !== 'admin' && rolename !== 'user') {
                throw new customError(400, 'Invalid rolename');
            }
            const [rows]: any = await db.query('SELECT id, username, email, fullName, roleId FROM users WHERE roleId = (SELECT id FROM roles WHERE roleName = ?)', [rolename]);
            if (rows.length === 0) {
                throw new customError(404, 'No users found');
            }
            const users: IUserToGet[] = rows.map((row: any) => {
                return {
                    id: row.id,
                    username: row.username,
                    email: row.email,
                    fullName: row.fullName,
                    role: row.roleId == 1 ? 'admin' : 'user'
                };
            });
            return users;
        } catch (error) {
            throw error;
        }
    }

    // async createUser(user: User): Promise<{ status: number; message: string }> {
    //     try {
    //         if (!user.username || !user.email || !user.password || !user.fullName) {
    //             throw new customError(400, 'No empty fields');
    //         }
    //         const [userExist]: any = await db.query('SELECT * FROM users WHERE username = ?', [user.username]);
    //         if (userExist.length > 0) {
    //             throw new customError(409, 'Username already exists');
    //         }

    //         // Hash the password
    //         const saltRounds = 10;
    //         const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    //         user.password = hashedPassword;

    //         await db.query('INSERT INTO users SET ?', [user]);
    //         return {
    //             status: 201,
    //             message: 'Created'
    //         };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async updateUser(id: string, user: IUserToUpdate): Promise<{ status: number; message: string }> {
        try {
            if (!id) {
                throw new customError(400, 'No id provided');
            }
            const [userExist]: any = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            if (userExist.length === 0) {
                throw new customError(404, 'User not found');
            }
            const [usernameExist]: any = await db.query('SELECT * FROM users WHERE username = ?', [user.username]);
            if (usernameExist.length > 0) {
                throw new customError(409, 'Username already exists');
            }
            // if (!user.username || !user.email || !user.password || !user.fullName) {
            //     throw new customError(400, 'No empty fields');
            // }
            await db.query('UPDATE users SET ? WHERE id = ?', [user, id]);
            return {
                status: 200,
                message: 'Updated'
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id: string): Promise<{ status: number; message: string }> {
        try {
            if (!id) {
                throw new customError(400, 'No id provided');
            }
            const [userExist]: any = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            if (userExist.length === 0) {
                throw new customError(404, 'User not found');
            }
            await db.query('DELETE FROM users WHERE id = ?', [id]);
            return {
                status: 200,
                message: 'Deleted'
            };
        } catch (error) {
            throw error;
        }
    }
}

const userService = new UserService();

export default userService;
