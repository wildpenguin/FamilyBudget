import type { Request, Response } from "express";
import * as z from "zod";
import type { AuthenticatedRequest } from "../services/authService";
import { familyInviteService } from "../services/familyInviteService";

const acceptToken = z.object({
	token: z.string().max(64),
});

const familyInvitesInput = z.object({
	invitedEmail: z.email(),
});

export const FamilyInvitesController = {
	async create(req: AuthenticatedRequest, res: Response) {
		const body = familyInvitesInput.safeParse(req.body);
		if (!body.success) {
			return res
				.status(400)
				.json({
					error: body.error.issues.map((issue) => issue.message).join(", "),
				});
		}
		try {
			const invite = await familyInviteService.createInvite(
				body.data.invitedEmail,
				req.userId,
			);
			return res.json({
				data: invite,
				meta: {
					total: 1,
				},
			});
		} catch (err) {
			res.status(400).json({
				error: err instanceof Error ? err.message : String(err),
			});
		}
	},

	async accept(req: Request, res: Response) {
		const params = acceptToken.safeParse(req.params);
		if (!params.success) {
			return res.status(400).json({ data: "Missing token information" });
		}
		console.log('moohahahaha')
		try {
			await familyInviteService.acceptInvite(params.data.token);
			return res.json({ data: "success" });
		} catch (err) {
			res.status(400).json(err instanceof Error ? err.message : String(err));
		}
	},
};
