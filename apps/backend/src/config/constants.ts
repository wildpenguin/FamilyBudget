export const BCRYPT_SALT_ROUNDS = 10;

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not set");
}

export const JWT_SECRET = process.env.JWT_SECRET;
