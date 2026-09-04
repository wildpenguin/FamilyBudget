import type { RequestHandler } from "express";
import { Router } from "express";
import { FamilyInvitesController } from "../controllers/familyInvites.controller";
import { authenticate } from "../middleware/authenticate";

export const familyInviteRouter = Router();
export const familyInviteRouterPublic = Router();

familyInviteRouterPublic.get(
	"/familyInvites/:token/accept",
	FamilyInvitesController.accept as RequestHandler,
);

familyInviteRouter.use(authenticate)

familyInviteRouter.post(
	"/familyInvites",
	FamilyInvitesController.create as RequestHandler,
);
