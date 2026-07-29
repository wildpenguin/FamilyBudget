import type { Request, Response } from 'express';
import * as z from 'zod';
import { authService } from '../services/authService';

const authSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export async function authenticateUser(req: Request, res: Response) {
    const result = authSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: z.treeifyError(result.error) });
    }
    const { email, password } = result.data;
    const token = await authService.login(email, password);
    if (!token) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    return res.json({ token });
}