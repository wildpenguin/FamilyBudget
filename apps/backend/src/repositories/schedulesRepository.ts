import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { schedules } from "../db/schema/schedules";

type ScheduleInput = Omit<
	typeof schedules.$inferInsert,
	"id" | "createdAt" | "createdByUserId"
>;
type UpdateScheduleInput = Partial<
	Omit<
		typeof schedules.$inferInsert,
		"id" | "createdAt" | "createdByUserId" | "familyId"
	>
>;

export const schedulesRepository = {
	async create(schedule: ScheduleInput, userId: number) {
		const [saved] = await db
			.insert(schedules)
			.values({
				...schedule,
				createdByUserId: userId,
			})
			.returning();

		return saved;
	},
	async update(
		scheduleId: number,
		familyId: number,
		updates: UpdateScheduleInput,
	) {
		const [updated] = await db
			.update(schedules)
			.set(updates)
			.where(
				and(eq(schedules.id, scheduleId), eq(schedules.familyId, familyId)),
			)
			.returning();

		return updated ?? null;
	},
	async delete(scheduleId: number, familyId: number) {
		const [deleted] = await db
			.delete(schedules)
			.where(
				and(eq(schedules.id, scheduleId), eq(schedules.familyId, familyId)),
			)
			.returning();

		return deleted ?? null;
	},
	async get(familyId: number, scheduleId?: number) {
		const conditions = [eq(schedules.familyId, familyId)];

		if (scheduleId) {
			conditions.push(eq(schedules.id, scheduleId));
		}
		const results = await db
			.select()
			.from(schedules)
			.where(and(...conditions));

		return results;
	},
};
