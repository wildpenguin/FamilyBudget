import { Router } from "express";

import { authRouter } from "./auth.routes";
import { categoriesRouter } from "./categories.routes";
import { familyInviteRouter } from "./familyInvites.routes";
import { transactionsRouter } from "./transactions.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/api", categoriesRouter);
router.use("/api", familyInviteRouter);
router.use("/api", transactionsRouter);
