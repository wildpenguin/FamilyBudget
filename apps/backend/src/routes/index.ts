import { Router } from 'express';

import { budgetRouter } from './budget.routes';

export const router = Router();

router.use('/budgets', budgetRouter);
