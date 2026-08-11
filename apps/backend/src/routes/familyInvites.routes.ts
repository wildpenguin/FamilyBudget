import { Router } from "express";
import { FamilyInvitesController } from "../controllers/familyInvites.controller";
import { authenticate } from "../middleware/authenticate";

export const FamilyInviteRouter = Router();

FamilyInviteRouter.use(authenticate);

FamilyInviteRouter.post("/familyInvites", FamilyInvitesController.create);
FamilyInviteRouter.post(
	"/familyInvites/:token/accept",
	FamilyInvitesController.accept,
);
