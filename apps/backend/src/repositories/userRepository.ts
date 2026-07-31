import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema/users";

export const userRepository = {
	async findByEmail(email: string) {
		const result = await db.select().from(users).where(eq(users.email, email));
		return result[0] ?? null;
	},
	async findByName(name: string) {
		const result = await db.select().from(users).where(eq(users.name, name));
		return result[0] ?? null;
	},
	async create(name: string, email: string, hashedPassword: string) {
		const result = await db
			.insert(users)
			.values({ name, email, password: hashedPassword })
			.returning();
		return result[0];
	},
};
