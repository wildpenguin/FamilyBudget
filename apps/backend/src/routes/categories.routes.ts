import type { RequestHandler } from "express";
import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";
import { authenticate } from "../middleware/authenticate";

export const categoriesRouter = Router();

categoriesRouter.use(authenticate);

// Handlers are typed with AuthenticatedRequest (req.userId guaranteed) since
// they only ever run after the `authenticate` middleware above.
categoriesRouter.get(
	"/categories/:familyId",
	CategoriesController.list as RequestHandler,
);
categoriesRouter.put(
	"/categories/:categoryId",
	CategoriesController.update as RequestHandler,
);
categoriesRouter.post(
	"/categories",
	CategoriesController.create as RequestHandler,
);
categoriesRouter.delete(
	"/categories/:categoryId",
	CategoriesController.delete as RequestHandler,
);
