import {Router} from 'express';
import prisma from '../lib/prisma';
import { creatUserController, getUsers } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
 
const router = Router();
router.get("/users",authMiddleware,getUsers);
router.post("/users",authMiddleware, roleMiddleware(["admin"]),creatUserController);
export default router;