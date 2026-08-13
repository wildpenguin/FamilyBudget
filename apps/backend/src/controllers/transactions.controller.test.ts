import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../index";
import {
	createCategory,
	createFamily,
	createFamilyMember,
	createTestUser,
	createTransaction,
} from "../tests/factories";
import { loginAs } from "../tests/helpers";

describe("GET /api/transactions", () => {
	it("returns a single transaction by id", async () => {
		const user = await createTestUser({ email: "txn-single@test.com" });
		const family = await createFamily("Txn family");
		await createFamilyMember(family.id, user.id);
		const [category] = await createCategory("Groceries", family.id, "expense");
		const transaction = await createTransaction(
			family.id,
			category.id,
			"Weekly shop",
			"42.50",
			"expense",
			user.id,
		);
		const token = await loginAs("txn-single@test.com");

		const res = await request(app)
			.get(`/api/transactions/${transaction.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({
			id: transaction.id,
			familyId: family.id,
			categoryId: category.id,
			description: "Weekly shop",
		});
	});

	it("lists all transactions for the authenticated user's family", async () => {
		const user = await createTestUser({ email: "txn-list@test.com" });
		const family = await createFamily("Txn list family");
		await createFamilyMember(family.id, user.id);
		const [category] = await createCategory("Salary", family.id, "income");
		await createTransaction(family.id, category.id, "Paycheck", "1000.00", "income", user.id);
		await createTransaction(family.id, category.id, "Bonus", "250.00", "income", user.id);
		const token = await loginAs("txn-list@test.com");

		const res = await request(app)
			.get("/api/transactions")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.meta.total).toBe(2);
		expect(res.body.data.map((t: { description: string }) => t.description).sort()).toEqual([
			"Bonus",
			"Paycheck",
		]);
	});
});

describe("POST /api/transactions", () => {
	it("creates a transaction for the authenticated user's family", async () => {
		const user = await createTestUser({ email: "txn-create@test.com" });
		const family = await createFamily("Txn create family");
		await createFamilyMember(family.id, user.id);
		const [category] = await createCategory("Groceries", family.id, "expense");
		const token = await loginAs("txn-create@test.com");

		const res = await request(app)
			.post("/api/transactions")
			.set("Authorization", `Bearer ${token}`)
			.send({
				familyId: family.id,
				categoryId: category.id,
				amount: "35.75",
				type: "expense",
				description: "Groceries run",
			});

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({
			familyId: family.id,
			categoryId: category.id,
			amount: "35.75",
			type: "expense",
			description: "Groceries run",
		});
	});

	it("rejects creating a transaction for a family the user doesn't belong to", async () => {
		await createTestUser({ email: "txn-create2@test.com" });
		const otherFamily = await createFamily("Other family");
		const [category] = await createCategory("Rent", otherFamily.id, "expense");
		const token = await loginAs("txn-create2@test.com");

		const res = await request(app)
			.post("/api/transactions")
			.set("Authorization", `Bearer ${token}`)
			.send({
				familyId: otherFamily.id,
				categoryId: category.id,
				amount: "10.00",
				type: "expense",
				description: "Not allowed",
			});

		expect(res.status).toBe(403);
	});

	it("returns 400 for an invalid payload", async () => {
		const user = await createTestUser({ email: "txn-create3@test.com" });
		const family = await createFamily("Txn create family 3");
		await createFamilyMember(family.id, user.id);
		const token = await loginAs("txn-create3@test.com");

		const res = await request(app)
			.post("/api/transactions")
			.set("Authorization", `Bearer ${token}`)
			.send({ familyId: family.id, amount: "not-a-number" });

		expect(res.status).toBe(400);
	});
});

describe("PUT /api/transactions/:id", () => {
	it("updates a transaction's fields", async () => {
		const user = await createTestUser({ email: "txn-update@test.com" });
		const family = await createFamily("Txn update family");
		await createFamilyMember(family.id, user.id);
		const [category] = await createCategory("Groceries", family.id, "expense");
		const transaction = await createTransaction(
			family.id,
			category.id,
			"Weekly shop",
			"42.50",
			"expense",
			user.id,
		);
		const token = await loginAs("txn-update@test.com");

		const res = await request(app)
			.put(`/api/transactions/${transaction.id}`)
			.set("Authorization", `Bearer ${token}`)
			.send({ amount: "50.00", description: "Weekly shop, updated" });

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({
			id: transaction.id,
			amount: "50.00",
			description: "Weekly shop, updated",
		});
	});
});

describe("DELETE /api/transactions/:id", () => {
    it("delete an existing transaction", async () => {
        const user = await createTestUser({ email: 'txn-delete@test.com' });
        const family = await createFamily("Smith family");
        await createFamilyMember(family.id, user.id);
        const [category] = await createCategory("Weekend spending", family.id, 'expense');
        const transaction = await createTransaction(
            family.id, 
            category.id, 
            "Cinema", 
            "25.59", 
            'expense', 
            user.id
        );
        const token = await loginAs('txn-delete@test.com');
        const res = await request(app)
            .delete(`/api/transactions/${transaction.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toMatchObject({
            familyId: family.id, 
            categoryId: category.id, 
            description: "Cinema", 
            amount: "25.59", 
            type: 'expense', 
            createdByUserId: user.id
        });

    })
})
