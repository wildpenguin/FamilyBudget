import type { Request, Response } from 'express';
import * as z from 'zod';

const authSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(8),
});

export function authenticateUser(req: Request, res: Response) {
    const result = authSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
    }
    const { username, password } = result.data;
}