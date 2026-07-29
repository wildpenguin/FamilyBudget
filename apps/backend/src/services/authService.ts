import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';

export const authService = {
    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return token;
    }
};