import { Router } from "express";

import { authRouter } from "./auth.routes";
import { categoriesRouter } from "./categories.routes";
import { FamilyInviteRouter } from "./familyInvites.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/api", categoriesRouter);
router.use("/api", FamilyInviteRouter);
