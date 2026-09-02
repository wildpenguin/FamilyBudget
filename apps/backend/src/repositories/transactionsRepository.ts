import type {
	InputTransactionsType,
	UpdateTransactionType,
} from "@ourbudget/shared";
import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { categories } from "../db/schema/categories";
import { transactions } from "../db/schema/transactions";

type BudgetSummary = {
	totalIncomeCents: number;
	totalExpensesCents: number;
	totalNetCents: number;
	byCategory: {
		categoryId: number;
		categoryName: string;
		type: "expense" | "income";
		totalAmountCents: string;
	}[];
};

export const transactionsRepository = {
	async create(
		transaction: InputTransactionsType,
		userId: number,
		familyId: number,
	) {
		const [saved] = await db
			.insert(transactions)
			.values({
				familyId: familyId,
				categoryId: transaction.categoryId,
				scheduleId: transaction.scheduleId,
				amountCents: transaction.amountCents,
				type: transaction.type,
				description: transaction.description,
				status: transaction.status,
				createdByUserId: userId,
			})
			.returning();

		return saved;
	},
	async update(
		transactionId: number,
		familyId: number,
		updates: UpdateTransactionType,
	) {
		const [updated] = await db
			.update(transactions)
			.set(updates)
			.where(
				and(
					eq(transactions.id, transactionId),
					eq(transactions.familyId, familyId),
				),
			)
			.returning();

		return updated ?? null;
	},
	async delete(transactionId: number, familyId: number) {
		const [deleted] = await db
			.delete(transactions)
			.where(
				and(
					eq(transactions.id, transactionId),
					eq(transactions.familyId, familyId),
				),
			)
			.returning();

		return deleted ?? null;
	},
	async get(
		familyId: number,
		transactionId?: number,
		filter?: { from?: string; to?: string; type?: "expense" | "income" },
		sort?: "asc" | "desc",
	) {
		const conditions = [eq(transactions.familyId, familyId)];

		if (transactionId) {
			conditions.push(eq(transactions.id, transactionId));
		}
		if (filter?.from) {
			conditions.push(gte(transactions.date, filter.from));
		}
		if (filter?.to) {
			conditions.push(lte(transactions.date, filter.to));
		}
		if (filter?.type) {
			conditions.push(eq(transactions.type, filter.type));
		}

		const sortFn = sort === "asc" ? asc : desc;

		const results = await db
			.select()
			.from(transactions)
			.where(and(...conditions))
			.orderBy(sortFn(transactions.date));

		return results;
	},
	async getSummary(
		familyId: number,
		filter: { from: string; to: string },
	): Promise<BudgetSummary> {
		const summary = await db
			.select({
				categoryId: transactions.categoryId,
				categoryName: categories.name,
				type: transactions.type,
				totalAmountCents: sql<string>`sum(${transactions.amountCents})`,
			})
			.from(transactions)
			.innerJoin(categories, eq(transactions.categoryId, categories.id))
			.where(
				and(
					eq(transactions.familyId, familyId),
					eq(transactions.status, "actual"),
					gte(transactions.date, filter.from),
					lte(transactions.date, filter.to),
				),
			)
			.groupBy(transactions.categoryId, categories.name, transactions.type);

		const expensesSummary = summary
			.filter((r) => r.type === "expense")
			.reduce((s, r) => s + Number(r.totalAmountCents), 0);
		const incomeSummary = summary
			.filter((r) => r.type === "income")
			.reduce((s, r) => s + Number(r.totalAmountCents), 0);

		const topExpenses = summary
			.filter((r) => r.type === "expense")
			.sort((a, b) => Number(b.totalAmountCents) - Number(a.totalAmountCents))
			.slice(0, 5);

		return {
			totalIncomeCents: incomeSummary,
			totalExpensesCents: expensesSummary,
			totalNetCents: incomeSummary - expensesSummary,
			byCategory: topExpenses,
		};
	},
	async getMonthlyChartData(familyId: number, from: string, to: string) {
		const data = await db
			.select({
				month: sql<string>`
				TO_CHAR(
					date_trunc('month', ${transactions.date}),
					'FMMon'
				)`,
				income: sql<string>`
					COALESCE(
						SUM(${transactions.amountCents})
						FILTER (WHERE ${transactions.type} = 'income'),
						0
					)`,
				expenses: sql<string>`
					COALESCE(
						SUM(${transactions.amountCents}) 
						FILTER (WHERE ${transactions.type} = 'expense'),
						0
				)`,
			})
			.from(transactions)
			.where(
				and(
					eq(transactions.familyId, familyId),
					gte(transactions.date, from),
					lte(transactions.date, to),
				),
			)
			.groupBy(sql`date_trunc('month', ${transactions.date})`)
			.orderBy(sql`date_trunc('month', ${transactions.date})`);

		return data;
	},
};
