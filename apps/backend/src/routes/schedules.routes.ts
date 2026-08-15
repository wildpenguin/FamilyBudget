import Router, { RequestHandler } from 'express';
import { schedulesController } from '../controllers/schedules.controller';
import { authenticate } from '../middleware/authenticate';

export const schedulesRouter = Router();

schedulesRouter.use(authenticate);

schedulesRouter.get("/schedules", schedulesController.getSchedules as RequestHandler);
schedulesRouter.get("/schedules/:id", schedulesController.getSchedules as RequestHandler);
schedulesRouter.post("/schedules", schedulesController.createSchedule as RequestHandler);
schedulesRouter.put("/schedules/:id", schedulesController.updateSchedule as RequestHandler);
schedulesRouter.delete("/schedules/:id", schedulesController.deleteSchedule as RequestHandler);

