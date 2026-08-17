import { type RequestHandler, Router } from "express";
import { BudgetsOverviewController } from "../controllers/budgetsOverview.controller";
import { authenticate } from "../middleware/authenticate";

export const BudgetsOverviewRouter = Router();

BudgetsOverviewRouter.use(authenticate);

BudgetsOverviewRouter.get(
	"/budgets/:familyId/overview",
	BudgetsOverviewController.overview as RequestHandler,
);
