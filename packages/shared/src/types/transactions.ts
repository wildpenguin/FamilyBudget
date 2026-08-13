import { z } from 'zod';

export const TransactionsInput = z.object({
    familyId: z.coerce.number(),
    categoryId: z.coerce.number(),
    scheduleId: z.coerce.number().optional(),
    amount: z
        .string()
        .regex(/^\d{1,10}(\.\d{1,2})?$/, "Amount must be a positive number with up to 2 decimal places")
        .refine((val) => Number(val) > 0, "Amount must be greater than zero"),
    type: z.enum(['income', 'expense']),
    description: z.string().max(255),
    status: z.enum(['actual', 'projected', 'skipped']).optional(),
});

export type TransactionsType = z.infer<typeof TransactionsInput>;

export const UpdateTransactionInput = TransactionsInput
    .pick({ categoryId: true, amount: true, type: true, description: true, status: true })
    .partial()
    .refine((data) => Object.keys(data).length > 0, "At least one field must be provided");

export type UpdateTransactionType = z.infer<typeof UpdateTransactionInput>;