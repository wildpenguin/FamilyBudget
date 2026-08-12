import type { RequestHandler } from "express";
import { Router } from "express";
import { FamilyInvitesController } from "../controllers/familyInvites.controller";
import { authenticate } from "../middleware/authenticate";

export const FamilyInviteRouter = Router();

FamilyInviteRouter.use(authenticate);

// Handlers are typed with AuthenticatedRequest (req.userId guaranteed) since
// they only ever run after the `authenticate` middleware above.
FamilyInviteRouter.post("/familyInvites", FamilyInvitesController.create as RequestHandler);
FamilyInviteRouter.post(
	"/familyInvites/:token/accept",
	FamilyInvitesController.accept as RequestHandler,
);
