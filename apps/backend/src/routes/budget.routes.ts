import { Router } from 'express';

import { listBudgets } from '../controllers/budget.controller';

export const budgetRouter = Router();

budgetRouter.get('/', listBudgets);