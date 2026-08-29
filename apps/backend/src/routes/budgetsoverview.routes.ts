import { type RequestHandler, Router } from "express";
import { BudgetsOverviewController } from "../controllers/budgetsOverview.controller";
import { authenticate } from "../middleware/authenticate";

export const BudgetsOverviewRouter = Router();

BudgetsOverviewRouter.use(authenticate);

BudgetsOverviewRouter.get(
	"/budgets/overview",
	BudgetsOverviewController.overview as RequestHandler,
);
BudgetsOverviewRouter.get(
	"/budgets/monthly",
	BudgetsOverviewController.monthlyChart as RequestHandler,
);
