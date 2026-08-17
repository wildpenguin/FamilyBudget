import { z } from "zod";

export const TransactionsInput = z.object({
	familyId: z.coerce.number(),
	categoryId: z.coerce.number(),
	scheduleId: z.coerce.number().optional(),
	amountCents: z.number().int().positive(),
	type: z.enum(["income", "expense"]),
	description: z.string().max(255),
	status: z.enum(["actual", "projected", "skipped"]).optional(),
});

export type TransactionsType = z.infer<typeof TransactionsInput>;

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
