import { Router } from 'express';

import { authenticateUser } from '../controllers/auth.controller'

export const loginRouter = Router();

loginRouter.post('/', authenticateUser);