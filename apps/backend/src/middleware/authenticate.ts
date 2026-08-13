import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants";

interface JwtPayload {
	userId: number;
}

declare global {
	namespace Express {
		interface Request {
			userId?: number;
		}
	}
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ error: "No token provided" });
	}
	const token = authHeader.split(" ")[1];

	try {
		const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
		req.userId = Number(payload.userId);
		next();
	} catch (_err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}
