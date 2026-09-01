import { z } from "zod";

export const ScheduleInput = z.object({
	categoryId: z.coerce.number(),
	description: z.string().max(255),
	amountCents: z
		.number()
		.int()
		.refine((val) => val !== 0, "Amount must not be zero"),
	frequency: z.enum(["once", "weekly", "biweekly", "monthly", "yearly"]),
	startDate: z.coerce.date(),
	endDate: z.coerce.date().optional(),
	dayOfMonth: z.coerce.number().int().min(1).max(31).optional(),
	dayOfWeek: z.coerce.number().int().min(0).max(6).optional(),
	active: z.boolean().optional(),
});

export type ScheduleType = z.infer<typeof ScheduleInput>;

export const UpdateScheduleInput = ScheduleInput
	.partial()
	.refine(
		(data) => Object.keys(data).length > 0,
		"At least one field must be provided",
	);

export type UpdateScheduleType = z.infer<typeof UpdateScheduleInput>;
