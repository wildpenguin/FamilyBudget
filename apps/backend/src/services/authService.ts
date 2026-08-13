import bcrypt from "bcrypt";
import type { Request } from "express";
import jwt from "jsonwebtoken";
import { BCRYPT_SALT_ROUNDS, JWT_SECRET } from "../config/constants";
import { userRepository } from "../repositories/userRepository";

export const authService = {
	async login(email: string, password: string) {
		const user = await userRepository.findByEmail(email);
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return null;
		}
		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: "7d",
		});

		return { token, user };
	},
	async register(name: string, email: string, password: string) {
		const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
		const output = await userRepository.create(name, email, hashedPassword);

		return output;
	},
};

export interface AuthenticatedRequest extends Request {
    userId: number;
}

