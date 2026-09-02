import { TransactionsInput, UpdateTransactionInput } from "@ourbudget/shared";
import type { Response } from "express";
import * as z from "zod";
import { familyMembersRepository } from "../repositories/familyMembersRepository";
import { transactionsRepository } from "../repositories/transactionsRepository";
import type { AuthenticatedRequest } from "../services/authService";

const getTransactionInput = z.object({
	id: z.coerce.number().optional(),
});

const transactionIdParams = z.object({
	id: z.coerce.number(),
});
const transactionDateQuery = z.object({
	filter: z
		.object({
			from: z.iso.date().optional(),
			to: z.iso.date().optional(),
			type: z.enum(["expense", "income"]).optional(),
		})
		.optional(),
	sort: z.enum(["asc", "desc"]).optional(),
});

export const transactionsController = {
	async getTransaction(req: AuthenticatedRequest, res: Response) {
		const input = getTransactionInput.safeParse(req.params);
		if (!input.success) {
			return res.status(400).json({ error: z.treeifyError(input.error) });
		}
		const familyMember = await familyMembersRepository.findByUser(req.userId);
		if (!familyMember) {
			return res.status(400).json({ error: "No groups found for this user" });
		}
		if (input.data.id) {
			const [transaction] = await transactionsRepository.get(
				familyMember.familyId,
				input.data.id,
			);
			if (!transaction) {
				return res.status(404).json({ error: "Transaction not found" });
			}
			return res.json({ data: transaction, meta: { total: 1 } });
		}
		const filterQuery = transactionDateQuery.safeParse(req.query);
		if (!filterQuery.success) {
			return res.status(400).json({ error: z.treeifyError(filterQuery.error) });
		}
		const transactions = await transactionsRepository.get(
			familyMember.familyId,
			undefined,
			filterQuery.data.filter,
			filterQuery.data.sort,
		);
		return res.json({
			data: transactions,
			meta: {
				total: transactions.length,
			},
		});
	},
	async saveTransaction(req: AuthenticatedRequest, res: Response) {
		const parsedBody = TransactionsInput.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}
		const member = await familyMembersRepository.findByUser(req.userId);
		if (!member?.familyId) {
			return res
				.status(403)
				.json({ error: "FamilyId is missing for the current user" });
		}
		const transaction = await transactionsRepository.create(
			parsedBody.data,
			req.userId,
			member.familyId,
		);
		return res.json({ data: transaction });
	},
	async updateTransaction(req: AuthenticatedRequest, res: Response) {
		const parsedParams = transactionIdParams.safeParse(req.params);
		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}
		const parsedBody = UpdateTransactionInput.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}
		const member = await familyMembersRepository.findByUser(req.userId);
		if (!member) {
			return res.status(403).json({ error: "No groups found for this user" });
		}
		const transaction = await transactionsRepository.update(
			parsedParams.data.id,
			member.familyId,
			parsedBody.data,
		);
		if (!transaction) {
			return res.status(404).json({ error: "Transaction not found" });
		}
		return res.json({ data: transaction });
	},
	async deleteTransaction(req: AuthenticatedRequest, res: Response) {
		const parsedParams = transactionIdParams.safeParse(req.params);
		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}
		const member = await familyMembersRepository.findByUser(req.userId);
		if (!member) {
			return res.status(403).json({ error: "No groups found for this user" });
		}
		const deleted = await transactionsRepository.delete(
			parsedParams.data.id,
			member.familyId,
		);
		if (!deleted) {
			return res.status(404).json({ error: "Transaction not found" });
		}
		return res.json({ data: deleted });
	},
};
