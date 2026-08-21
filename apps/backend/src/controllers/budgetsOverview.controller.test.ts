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

describe("GET /api/budgets/:familyId/overview", () => {
	it("returns a budget overview for the authenticated user's family", async () => {
		const user = await createTestUser({ email: "overview@test.com" });
		const family = await createFamily("Overview family");
		await createFamilyMember(family.id, user.id);
		const [expenseCategory] = await createCategory(
			"Groceries",
			family.id,
			"expense",
		);
		const [incomeCategory] = await createCategory(
			"Salary",
			family.id,
			"income",
		);
		await createTransaction(
			family.id,
			expenseCategory.id,
			"Weekly shop",
			15000,
			"expense",
			user.id,
		);
		await createTransaction(
			family.id,
			incomeCategory.id,
			"Paycheck",
			200000,
			"income",
			user.id,
		);
		const token = await loginAs("overview@test.com");

		const res = await request(app)
			.get(`/api/budgets/${family.id}/overview`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({
			totalIncomeCents: 200000,
			totalExpensesCents: 15000,
			totalNetCents: 185000,
		});
		expect(res.body.meta.total).toBe(2);
	});
});
