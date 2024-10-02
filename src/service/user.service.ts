import db from '../database/connection'; 
import bcrypt from 'bcrypt'; 
import ApiError from '../utils/ApiError';

interface User {
    id?: string; 
    username: string;
    email: string;
    password: string; 
    fullName: string; 
    roleId?: number; 
}

class UserService {
    async getAllUsers(): Promise<User[]> {
        try {
            const [users]: any = await db.query('SELECT id, username, email, fullName, roleId FROM users');
            if (users.length === 0) {
                throw new ApiError(404, 'No users found');
            }
            return users;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: string): Promise<User[]> {
        try {
            const [user]: any = await db.query('SELECT id, username, email, fullName, roleId FROM users WHERE id = ?', [id]);
            if (user.length === 0) {
                throw new ApiError(404, 'User not found');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserByRoleName(rolename: string): Promise<User[]> {
        try {
            const [users]: any = await db.query('SELECT id, username, email, fullName, roleId FROM users WHERE roleId = (SELECT id FROM roles WHERE roleName = ?)', [rolename]);
            if (users.length === 0) {
                throw new ApiError(404, 'No users found');
            }
            return users;
        } catch (error) {
            throw error;
        }
    }

    async createUser(user: User): Promise<{ status: number; message: string }> {
        try {
            if (!user.username || !user.email || !user.password || !user.fullName) {
                throw new ApiError(400, 'No empty fields');
            }
            const [userExist]: any = await db.query('SELECT * FROM users WHERE username = ?', [user.username]);
            if (userExist.length > 0) {
                throw new ApiError(409, 'Username already exists');
            }

            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);

            user.password = hashedPassword;

            await db.query('INSERT INTO users SET ?', [user]);
            return {
                status: 201,
                message: 'Created'
            };
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id: string, user: User): Promise<{ status: number; message: string }> {
        try {
            if (!id) {
                throw new ApiError(400, 'No id provided');
            }
            const [usernameExist]: any = await db.query('SELECT * FROM users WHERE username = ?', [user.username]);
            if (usernameExist.length > 0) {
                throw new ApiError(409, 'Username already exists');
            }
            if (!user.username || !user.email || !user.password || !user.fullName) {
                throw new ApiError(400, 'No empty fields');
            }
            const [userExist]: any = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            if (userExist.length === 0) {
                throw new ApiError(404, 'User not found');
            }
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
                throw new ApiError(400, 'No id provided');
            }
            const [userExist]: any = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            if (userExist.length === 0) {
                throw new ApiError(404, 'User not found');
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
