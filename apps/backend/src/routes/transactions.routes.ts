import { RequestHandler, Router } from 'express';
import { authenticate } from '../middleware/authenticate'; 
import { transactionsController } from '../controllers/transactions.controller';

export const transactionsRouter = Router();

transactionsRouter.use(authenticate);

transactionsRouter.get("/transactions", transactionsController.getTransaction as RequestHandler);
transactionsRouter.get("/transactions/:id", transactionsController.getTransaction as RequestHandler);
transactionsRouter.post("/transactions", transactionsController.saveTransaction as RequestHandler);
transactionsRouter.put("/transactions/:id", transactionsController.updateTransaction as RequestHandler);
transactionsRouter.delete("/transactions/:id", transactionsController.deleteTransaction as RequestHandler);
