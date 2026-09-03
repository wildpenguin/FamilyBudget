import { ScheduleInput, UpdateScheduleInput } from "@ourbudget/shared";
import {
	addDays,
	addMonths,
	addWeeks,
	differenceInDays,
	fromUnixTime,
	getDate,
	getDay,
	getWeekOfMonth,
	setDate,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import type { Response } from "express";
import { z } from "zod";
import { familyMembersRepository } from "../repositories/familyMembersRepository";
import { schedulesRepository } from "../repositories/schedulesRepository";
import type { AuthenticatedRequest } from "../services/authService";

const getScheduleInput = z.object({
	id: z.coerce.number().optional(),
});

const scheduleIdParams = z.object({
	id: z.coerce.number(),
});

export const schedulesController = {
	async createSchedule(req: AuthenticatedRequest, res: Response) {
		const parsedBody = ScheduleInput.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}
		const member = await familyMembersRepository.findByUser(req.userId);
		if (!member?.familyId) {
			return res.status(403).json({ error: "Missing family from the user" });
		}
		const schedule = await schedulesRepository.create(
			parsedBody.data,
			req.userId,
			member.familyId,
		);
		return res.json({ data: schedule });
	},
	async updateSchedule(req: AuthenticatedRequest, res: Response) {
		const parsedParams = scheduleIdParams.safeParse(req.params);
		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}
		const parsedBody = UpdateScheduleInput.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}
		const member = await familyMembersRepository.findByUser(req.userId);
		if (!member) {
			return res.status(403).json({ error: "No groups found for this user" });
		}
		const schedule = await schedulesRepository.update(
			parsedParams.data.id,
			member.familyId,
			parsedBody.data,
		);
		if (!schedule) {
			return res.status(404).json({ error: "Schedule not found" });
		}
		return res.json({ data: schedule });
	},
	async deleteSchedule(req: AuthenticatedRequest, res: Response) {
		const parsedParams = scheduleIdParams.safeParse(req.params);
		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}
		const member = await familyMembersRepository.findByUser(req.userId);
		if (!member) {
			return res.status(403).json({ error: "No groups found for this user" });
		}
		const deleted = await schedulesRepository.delete(
			parsedParams.data.id,
			member.familyId,
		);
		if (!deleted) {
			return res.status(404).json({ error: "Schedule not found" });
		}
		return res.json({ data: deleted });
	},
	async getSchedules(req: AuthenticatedRequest, res: Response) {
		const input = getScheduleInput.safeParse(req.params);
		if (!input.success) {
			return res.status(400).json({ error: z.treeifyError(input.error) });
		}
		const familyMember = await familyMembersRepository.findByUser(req.userId);
		if (!familyMember) {
			return res.status(400).json({ error: "No groups found for this user" });
		}
		if (input.data.id) {
			const [schedule] = await schedulesRepository.get(
				familyMember.familyId,
				input.data.id,
			);
			if (!schedule) {
				return res.status(404).json({ error: "Schedule not found" });
			}
			return res.json({ data: schedule, meta: { total: 1 } });
		}

		const schedules = await schedulesRepository.get(familyMember.familyId);
		return res.json({
			data: schedules,
			meta: {
				total: schedules.length,
			},
		});
	},
	async getUpcoming(req: AuthenticatedRequest, res: Response) {
		const family = await familyMembersRepository.findByUser(req.userId);
		if (!family) {
			return res.status(400).json({ error: "No groups found for this user" });
		}
		const all = await schedulesRepository.get(family.familyId);
		const currentWeek = getWeekOfMonth(new Date());
		const currentWeekDay = getDay(new Date());
		const today = new Date();

		const upcoming = all
			.map(({ schedules, categories }, index) => {
				const dayOfWeek = schedules.dayOfWeek ?? 1; // default always Monday

				switch (schedules.frequency) {
					case "weekly":
						if (currentWeekDay < dayOfWeek) {
							return {
								index,
								timestamp: addDays(startOfWeek(today), dayOfWeek).getTime(),
							};
						}
						return {
							index,
							timestamp: addDays(
								startOfWeek(addWeeks(today, 1)),
								dayOfWeek,
							).getTime(),
						};
					case "biweekly":
						if (currentWeek % 2 !== 0) {
							// biweekly happens 2, 4 week of month and we only want the 1, 3 weeks
							return {
								index,
								timestamp: addDays(
									startOfWeek(addWeeks(today, 1)),
									dayOfWeek,
								).getTime(),
							};
						}
						return undefined;
					case "monthly":
						if (!schedules.dayOfMonth) {
							return undefined;
						}
						if (getDate(today) <= schedules.dayOfMonth) {
							return {
								index,
								timestamp: setDate(today, schedules.dayOfMonth).getTime(),
							};
						}
						return {
							index,
							timestamp: setDate(
								addMonths(startOfMonth(today), 1),
								schedules.dayOfMonth,
							).getTime(),
						};
					default:
						throw new Error(`Unsupported frequency: ${schedules.frequency}`);
				}
			})
			.filter(
				(item): item is { index: number; timestamp: number } =>
					item !== undefined,
			);

		const closest =
			upcoming.length > 0
				? upcoming.reduce((min, current) =>
						current.timestamp < min.timestamp ? current : min,
					)
				: null;
		if (closest) {
			const { schedules, categories } = all[closest.index];

			return res.json({
				data: {
					dueInDays: differenceInDays(new Date(closest.timestamp), today),
					amountCents: schedules.amountCents,
					title: schedules.description,
					category: categories?.name,
					type: categories?.type,
				},
				meta: {},
			});
		}

		return res.json({ data: {}, meta: {} });
	},
};
