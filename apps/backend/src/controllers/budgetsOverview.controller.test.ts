import { format, subMonths } from "date-fns";
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

describe("GET /api/budgets/overview", () => {
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
			.get("/api/budgets/overview")
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

describe("GET /api/budgets/monthly", () => {
	it("returns a monthly income/expense breakdown spanning several months", async () => {
		const user = await createTestUser({ email: "monthly@test.com" });
		const family = await createFamily("Monthly chart family");
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

		// Seed one income + one expense transaction per month, for the
		// current month and the 3 months before it.
		const monthOffsets = [3, 2, 1, 0];
		for (const monthsAgo of monthOffsets) {
			const date = format(subMonths(new Date(), monthsAgo), "yyyy-MM-dd");
			await createTransaction(
				family.id,
				expenseCategory.id,
				`Groceries ${monthsAgo}`,
				10000,
				"expense",
				user.id,
				{ date },
			);
			await createTransaction(
				family.id,
				incomeCategory.id,
				`Salary ${monthsAgo}`,
				50000,
				"income",
				user.id,
				{ date },
			);
		}

		const token = await loginAs("monthly@test.com");

		const res = await request(app)
			.get("/api/budgets/monthly")
			.query({ months: 3 })
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.meta.total).toBe(4);
		expect(res.body.data).toHaveLength(4);

		for (const point of res.body.data) {
			expect(point.income).toBe("50000");
			expect(point.expense).toBe("10000");
		}

		// Returned in chronological order, oldest month first.
		const months = res.body.data.map((point: { month: string }) =>
			new Date(point.month).getTime(),
		);
		const sortedMonths = [...months].sort((a, b) => a - b);
		expect(months).toEqual(sortedMonths);
	});

	it("returns 400 when months is missing", async () => {
		const user = await createTestUser({ email: "monthly-invalid@test.com" });
		const family = await createFamily("Monthly invalid family");
		await createFamilyMember(family.id, user.id);
		const token = await loginAs("monthly-invalid@test.com");

		const res = await request(app)
			.get("/api/budgets/monthly")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(400);
	});
});
