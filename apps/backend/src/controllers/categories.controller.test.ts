import request from "supertest";
import { describe, expect, it } from "vitest";
import { db } from "../db";
import { categories } from "../db/schema/categories";
import app from "../index";
import {
	createFamily,
	createFamilyMember,
	createTestUser,
} from "../tests/factories";
import { loginAs } from "../tests/helpers";

describe("POST /api/categories", () => {
	it("creates a category for the authenticated user's family", async () => {
		const user = await createTestUser({ email: "creator@test.com" });
		const family = await createFamily("Test Family");
		await createFamilyMember(family.id, user.id);
		const token = await loginAs("creator@test.com");

		const res = await request(app)
			.post("/api/categories")
			.set("Authorization", `Bearer ${token}`)
			.send({ familyId: family.id, name: "Groceries", type: "expense" });

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({
			familyId: family.id,
			name: "Groceries",
			type: "expense",
		});
	});

	it("rejects requests without a token", async () => {
		const family = await createFamily("Test Family");

		const res = await request(app)
			.post("/api/categories")
			.send({ familyId: family.id, name: "Groceries", type: "expense" });

		expect(res.status).toBe(401);
	});

	it("returns 400 for an invalid payload", async () => {
		const _user = await createTestUser({ email: "creator2@test.com" });
		const token = await loginAs("creator2@test.com");

		const res = await request(app)
			.post("/api/categories")
			.set("Authorization", `Bearer ${token}`)
			.send({ name: "Groceries" });

		expect(res.status).toBe(400);
	});

	it("update the name of the category", async () => {
		const user = await createTestUser({ email: "update@test.com" });
		const token = await loginAs("update@test.com");
		const family = await createFamily("Smith's family");
		await createFamilyMember(family.id, user.id);
		const [category] = await db
			.insert(categories)
			.values({ familyId: family.id, name: "Vracation", type: "expense" })
			.returning();

		const res = await request(app)
			.put(`/api/categories/${category.id}`)
			.set("Authorization", `Bearer ${token}`)
			.send({ name: "Vacation" });

		expect(res.status).toBe(200);
		expect(res.body.data.name).toMatch("Vacation");
	});

	it("deletes a category", async () => {
		const user = await createTestUser({ email: "delete@test.com" });
		const token = await loginAs("delete@test.com");
		const family = await createFamily("Delete family");
		await createFamilyMember(family.id, user.id);
		const [category] = await db
			.insert(categories)
			.values({ familyId: family.id, name: "Rent", type: "expense" })
			.returning();

		const res = await request(app)
			.delete(`/api/categories/${category.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({ id: category.id, name: "Rent" });
	});

	it("lists categories for the authenticated user's family", async () => {
		const user = await createTestUser({ email: "lister@test.com" });
		const token = await loginAs("lister@test.com");
		const family = await createFamily("Lister family");
		await createFamilyMember(family.id, user.id);
		await db.insert(categories).values([
			{ familyId: family.id, name: "Salary", type: "income" },
			{ familyId: family.id, name: "Groceries", type: "expense" },
		]);

		const res = await request(app)
			.get(`/api/categories/${family.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.meta.total).toBe(2);
		expect(res.body.data.map((c: { name: string }) => c.name).sort()).toEqual([
			"Groceries",
			"Salary",
		]);
	});
});
