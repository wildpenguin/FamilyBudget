import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema/users";

export const userRepository = {
	async findByEmail(email: string) {
		const [user] = await db.select().from(users).where(eq(users.email, email));
		return user;
	},
	async findByName(name: string) {
		const [user] = await db.select().from(users).where(eq(users.name, name));
		return user;
	},
	async create(name: string, email: string, hashedPassword: string) {
		const result = await db
			.insert(users)
			.values({ name, email, password: hashedPassword })
			.returning();
		return result[0];
	},
};
