import type {
	TransactionsType,
	UpdateTransactionType,
} from "@ourbudget/shared";
import { and, eq, gte, lte, sql } from "drizzle-orm";
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
		totalAmountCents: number;
	}[];
};

export const transactionsRepository = {
	async create(transaction: TransactionsType, userId: number) {
		const [saved] = await db
			.insert(transactions)
			.values({
				familyId: transaction.familyId,
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
		filter?: { from?: string; to?: string },
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
		const results = await db
			.select()
			.from(transactions)
			.where(and(...conditions));

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

		return {
			totalIncomeCents: incomeSummary,
			totalExpensesCents: expensesSummary,
			totalNetCents: incomeSummary - expensesSummary,
			byCategory: summary,
		};
	},
};
