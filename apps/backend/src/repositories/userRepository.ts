import { eq } from "drizzle-orm";
import { db } from "../db";
import { families } from "../db/schema/families";
import { familyMembers } from "../db/schema/familyMembers";
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
		const user = await db.transaction(async (tx) => {
			const [user] = await tx
				.insert(users)
				.values({ name, email, password: hashedPassword })
				.returning();

			const [family] = await tx
				.insert(families)
				.values({ name: `${name}'s Family` })
				.returning();

			await tx
				.insert(familyMembers)
				.values({ familyId: family.id, userId: user.id });

			return user;
		});
		return user;
	},
};
