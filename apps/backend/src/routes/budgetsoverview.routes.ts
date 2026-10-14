import { type RequestHandler, Router } from "express";
import { BudgetsOverviewController } from "../controllers/budgetsOverview.controller";
import { authenticate } from "../middleware/authenticate";

export const budgetsOverviewRouter = Router();

budgetsOverviewRouter.use(authenticate);

budgetsOverviewRouter.get(
	"/budgets/overview",
	BudgetsOverviewController.overview as RequestHandler,
);
budgetsOverviewRouter.get(
	"/budgets/monthly",
	BudgetsOverviewController.monthlyChart as RequestHandler,
);
