import { Router } from "express";

import { authRouter } from "./auth.routes";
import { budgetRouter } from "./budget.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/api", budgetRouter);
