import type { Request, Response } from "express";
import * as z from "zod";
import { authService } from "../services/authService";

const authSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

const registerSchema = z.object({
	name: z.string().max(30),
	email: z.email(),
	password: z.string().min(8),
});

export const AuthController = {
	async login(req: Request, res: Response) {
		const result = authSchema.safeParse(req.body);

		if (!result.success) {
			return res.status(400).json(z.treeifyError(result.error));
		}
		const { email, password } = result.data;
		const loginResult = await authService.login(email, password);
		if (!loginResult) {
			return res.status(401).json({ error: "Invalid credentials" });
		}
		const { token, user } = loginResult;

		return res.json({
			token: token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		});
	},
	async register(req: Request, res: Response) {
		const result = registerSchema.safeParse(req.body);
		if (!result.success) {
			return res.status(400).json(z.treeifyError(result.error));
		}
		const { name, email, password } = result.data;
		try {
			const user = await authService.register(name, email, password);
			return res.json({ user: user });
		} catch (err) {
			res.status(400).json(err instanceof Error ? err.message : String(err));
		}
	},
};
