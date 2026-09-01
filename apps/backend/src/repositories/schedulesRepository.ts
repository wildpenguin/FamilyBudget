import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { schedules } from "../db/schema/schedules";
import { categoryRepository } from "./categoryRepository";
import { categories } from "../db/schema/categories";

type ScheduleInput = Omit<
	typeof schedules.$inferInsert,
	"id" | "createdAt" | "createdByUserId" | "familyId"
>;
type UpdateScheduleInput = Partial<
	Omit<
		typeof schedules.$inferInsert,
		"id" | "createdAt" | "createdByUserId" | "familyId"
	>
>;

export const schedulesRepository = {
	async create(schedule: ScheduleInput, userId: number, familyId: number) {
		const category = await categoryRepository.findById(schedule.categoryId);
		if (!category) {
			throw new Error('Category not found');
		}
		const [saved] = await db
			.insert(schedules)
			.values({
				...schedule,
				categoryId: category.id,
				familyId,
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
			.where(and(...conditions))
			.leftJoin(categories, eq(schedules.categoryId, categories.id));

		return results;
	},
};
