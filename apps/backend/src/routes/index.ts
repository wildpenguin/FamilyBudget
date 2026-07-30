import { Router } from 'express';

import { loginRouter } from './auth.routes';
import { budgetRouter } from './budget.routes';

export const router = Router();

router.use('/login', loginRouter);
router.use('/budgets', budgetRouter);
