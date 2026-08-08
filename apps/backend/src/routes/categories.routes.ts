import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";
import { authenticate } from "../middleware/authenticate";

export const categoriesRouter = Router();

categoriesRouter.use(authenticate);

categoriesRouter.get("/categories/:familyId", CategoriesController.list);
categoriesRouter.put("/categories/:categoryId", CategoriesController.update);
categoriesRouter.post("/categories", CategoriesController.create);
categoriesRouter.delete("/categories/:categoryId", CategoriesController.delete);
