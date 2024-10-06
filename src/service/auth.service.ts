import db from "../database/connection"; 
import customError from "../utils/customError";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'abc';

interface User {
    username: string;
    password: string;
    email: string;
    fullname: string;
    role: number; 
}

class AuthService {
    async register(user: User): Promise<{ status: number; message: string }> {
        try {
            if (!user.username || !user.password || !user.email || !user.fullname || !user.role) 
                throw new customError(400, 'No empty fields');

            const userExist : any = await db.query('SELECT * FROM users WHERE username = ?', [user.username]);
            if (userExist[0].length !== 0) {
                throw new customError(409, 'Username already exists');
            }

            // Hash the password
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(user.password, saltRound);

            user.password = hashedPassword;
            await db.query('INSERT INTO users ( username, password, email, fullname, roleId ) VALUES ( ?, ?, ?, ?, ? );', [user.username, user.password, user.email, user.fullname, user.role]);
            return {
                status: 201,
                message: 'Register successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    async login(user: { username: string; password: string }): Promise<{ status: number; message: string; token: string }> {
        try {
            // Retrieve the user from the database
            if (!user.username || !user.password)
                throw new customError(400, 'No empty fields');

            const userExist : any = await db.query('SELECT * FROM users WHERE username = ?', [user.username]);
            if (userExist[0].length === 0) {
                throw new customError(404, 'Invalid username or password');
            }

            // Compare password
            const users = userExist[0][0];
            const passwordMatch = await bcrypt.compare(user.password, users.password);
            if (!passwordMatch) 
                throw new customError(400, 'Invalid username or password');
            else {
                // Create JWT token
                const [roleId] = await db.query('SELECT roleId FROM users WHERE username = ?', [user.username]);
                const token = jwt.sign({ role: roleId }, jwtSecret, { expiresIn: '1h' });
                return {
                    status: 200,
                    message: 'Login successfully',
                    token: token
                };
            }
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;
