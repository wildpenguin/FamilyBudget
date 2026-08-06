import { Router } from "express";

import { authRouter } from "./auth.routes";
import { categoriesRouter } from "./categories.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/api", categoriesRouter);
