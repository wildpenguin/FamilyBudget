import { familyInvitesSchema } from "@ourbudget/shared";
import type { Request, Response } from "express";
import * as z from "zod";
import { familyInviteService } from "../services/familyInviteService";

const acceptToken = z.object({
	token: z.string().max(64),
});

export const FamilyInvitesController = {
	async create(req: Request, res: Response) {
		const body = familyInvitesSchema.safeParse(req.body);
		if (!body.success) {
			return res.status(400).json(z.treeifyError(body.error));
		}
		if (!req.userId) {
			return res.status(400).json({ error: "User is missing" });
		}
		const invite = await familyInviteService.createInvite({
			familyId: body.data.familyId,
			invitedEmail: body.data.invitedEmail,
			invitedByUserId: req.userId,
		});
		return res.json({
			data: invite,
			meta: {
				total: 1,
			},
		});
	},

	async accept(req: Request, res: Response) {
		if (!req.userId) {
			return res.status(400).json({ error: "Missing User" });
		}
		const params = acceptToken.safeParse(req.params);
		if (!params.success) {
			return res.status(400).json({ data: "Missing token information" });
		}
		try {
			await familyInviteService.acceptInvite(params.data.token, req.userId);
			return res.json({ data: "success" });
		} catch (err) {
			res.status(400).json(err instanceof Error ? err.message : String(err));
		}
	},
};
