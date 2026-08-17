import { db } from "../db";
import { eq, and, gte, lte } from 'drizzle-orm';
import { transactions } from "../db/schema/transactions";
import { TransactionsType, UpdateTransactionType } from "@ourbudget/shared";



export const transactionsRepository = {
    async create(transaction: TransactionsType, userId: number) {
        const [saved] = await db.insert(transactions).values({
            familyId: transaction.familyId,
            categoryId: transaction.categoryId,
            scheduleId: transaction.scheduleId,
            amount: transaction.amount,
            type: transaction.type,
            description: transaction.description,
            status: transaction.status,
            createdByUserId: userId,
        }).returning();

        return saved;
    },
    async update(transactionId: number, familyId: number, updates: UpdateTransactionType) {
        const [updated] = await db
            .update(transactions)
            .set(updates)
            .where(and(eq(transactions.id, transactionId), eq(transactions.familyId, familyId)))
            .returning();

        return updated ?? null;
    },
    async delete(transactionId: number, familyId: number) {
        const [deleted] = await db.delete(transactions).where(and(
            eq(transactions.id, transactionId),
            eq(transactions.familyId, familyId)
        )).returning();

        return deleted ?? null;
    },
    async get(familyId: number, transactionId?: number, filter?: {from?: string, to?: string}) {
        const conditions = [eq(transactions.familyId, familyId)];

        if (transactionId) {
            conditions.push(eq(transactions.id, transactionId));
        }
        if (filter?.from) {
            conditions.push(gte(transactions.date, filter.from));
        }
        if (filter?.to) {
            conditions.push(lte(transactions.date, filter.to))
        }
        const results = await db
            .select()
            .from(transactions)
            .where(and(...conditions));

        return results;
    },
}