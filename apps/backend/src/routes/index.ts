import { Router } from "express";

import { authRouter } from "./auth.routes";
import { BudgetsOverviewRouter } from "./budgetsoverview.routes";
import { categoriesRouter } from "./categories.routes";
import {
	familyInviteRouter,
	familyInviteRouterPublic,
} from "./familyInvites.routes";
import { schedulesRouter } from "./schedules.routes";
import { transactionsRouter } from "./transactions.routes";

export const router = Router();

router.use("/auth", authRouter);
// Must be registered before any router that applies `authenticate` via a
// path-less `.use()` (categoriesRouter, familyInviteRouter, etc.) — those
// intercept and 401 every request under /api regardless of which route it
// actually matches, so a public route mounted after them is unreachable.
router.use("/api", familyInviteRouterPublic);
router.use("/api", categoriesRouter);
router.use("/api", familyInviteRouter);
router.use("/api", transactionsRouter);
router.use("/api", schedulesRouter);
router.use("/api", BudgetsOverviewRouter);
