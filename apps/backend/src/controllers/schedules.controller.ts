import { ScheduleInput, UpdateScheduleInput } from "@ourbudget/shared";
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
		if (member?.familyId !== parsedBody.data.familyId) {
			return res.status(403).json({ error: "Group mismatch for this user" });
		}
		const schedule = await schedulesRepository.create(
			parsedBody.data,
			req.userId,
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
};
