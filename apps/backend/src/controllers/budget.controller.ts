import type { Budget } from '@ourbudget/shared';
import type { Request, Response } from 'express';

const budgets: Budget[] = [];

export function listBudgets(_req: Request, res: Response) {
  res.json(budgets);
}

