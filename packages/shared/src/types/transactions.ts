import { z } from "zod";

export const TransactionsInput = z.object({
	categoryId: z.coerce.number(),
	scheduleId: z.coerce.number().optional(),
	amountCents: z.number().int().positive(),
	type: z.enum(["income", "expense"]),
	description: z.string().max(255),
	status: z.enum(["actual", "projected", "skipped"]).optional(),
	date: z.coerce.date().optional(),
});

export type InputTransactionsType = z.infer<typeof TransactionsInput>;

export const UpdateTransactionInput = TransactionsInput.pick({
	categoryId: true,
	amountCents: true,
	type: true,
	description: true,
	status: true,
})
	.partial()
	.refine(
		(data) => Object.keys(data).length > 0,
		"At least one field must be provided",
	);

export type UpdateTransactionType = z.infer<typeof UpdateTransactionInput>;

export type GetTransactionType = {
	id: number;
	familyId: number;
	categoryId: number;
	scheduleId?: number;
	createdByUserId: number;
	amountCents: number;
	type: "expense" | "income";
	date: string;
	description?: string;
	status: string;
};
