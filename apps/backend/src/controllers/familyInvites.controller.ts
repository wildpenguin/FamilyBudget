import {
	createCategorySchema,
	familyInvitesSchema,
	getCategorySchema,
} from "@ourbudget/shared";
import type { Request, Response } from "express";
import * as z from "zod";
import { familyMembersRepository } from "../repositories/familyMembersRepository";

export const FamilyMembersController = {
	async create(req: Request, res: Response) {
		const body = familyInvitesSchema.safeParse(req.body);
		if (!body.success) {
			return res.json(z.treeifyError(body.error));
		}

		const response = await familyMembersRepository.create({
			familyId: body.data.familyId,
			invitedEmail: body.data.invitedEmail,
			invitedByUserId: body.data.invitedByUserId,
		});
	},
};
