import db from "../database/connection"; // Sử dụng import
import mailService from "../middleware/mailService"; // Sử dụng import
import ApiError from "../utils/ApiError";
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
    roleId: number; 
}

class AuthService {
    async register(user: User): Promise<{ status: number; message: string }> {
        try {
            if (!user.username || !user.password || !user.email || !user.fullname || !user.roleId) 
                throw new ApiError(400, 'No empty fields');

            const userExist : any = await db.query('SELECT * FROM users WHERE username = ?', [user.username]);
            if (userExist[0].length !== 0) {
                throw new ApiError(409, 'Username already exists');
            }

            // Hash the password
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(user.password, saltRound);

            user.password = hashedPassword;
            await db.query('INSERT INTO users SET ?', [user]);
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
                throw new ApiError(400, 'No empty fields');

            const userExist : any = await db.query('SELECT * FROM users WHERE username = ?', [user.username]);
            if (userExist[0].length === 0) {
                throw new ApiError(404, 'Invalid username or password');
            }

            // Compare password
            const users = userExist[0][0];
            const passwordMatch = await bcrypt.compare(user.password, users.password);
            if (!passwordMatch) 
                throw new ApiError(400, 'Invalid username or password');
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

    async getMail(email: string): Promise<User> {
        try {
            const emailExist : any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
            if (emailExist[0].length === 0) {
                throw new ApiError(404, 'Email not found');
            }
            return emailExist[0][0];
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(email: string): Promise<{ status: number; message: string }> {
        try {
            let passwordResetToken = '';
            for (let i = 0; i < 6; i++) {
                passwordResetToken += Math.floor(Math.random() * 10).toString();
            }
            const passwordResetExpiration = new Date(Date.now() + 10 * 60 * 1000);
            const query = 'UPDATE users SET passwordResetToken = ?, passwordResetExpiration = ? WHERE email = ?';
            const updateStatus = await db.query(query, [passwordResetToken, passwordResetExpiration, email]);
            if (updateStatus) {
                mailService.sendEmail({
                    emailFrom: 'daolehanhnguyen@gmail.com',
                    emailTo: email,
                    emailSubject: 'Reset password',
                    emailText: 'Here is your reset password token: ' + passwordResetToken,
                });
                return {
                    status: 200,
                    message: 'Reset password email sent successfully'
                };
            } else {
                throw new ApiError(400, 'Cannot send email');
            }
        } catch (error) {
            throw error;
        }
    }

    async isValidUser(email: string, passwordResetToken: string): Promise<{ status: number; message: string }> {
        try {
            const query = 'SELECT * FROM users WHERE email = ? AND passwordResetToken = ? AND passwordResetExpiration >= ?';
            const user : any = await db.query(query, [email, passwordResetToken, new Date(Date.now())]);
            if (user[0].length === 0) 
                throw new ApiError(404, 'Invalid token or token has expired');
            return {
                status: 200,
                message: 'Valid token'
            };
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(email: string, newPassword: string): Promise<{ status: number; message: string }> {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const update = 'UPDATE users SET password = ?, passwordResetToken = null, passwordResetExpiration = null WHERE email = ?';
            const updateStatus : any = await db.query(update, [hashedPassword, email]);
            if (updateStatus.affectedRows === 0) 
                throw new ApiError(400, 'Cannot reset password');
            return {
                status: 200,
                message: 'Update password successfully'
            };
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;
