import {Router} from 'express';
import prisma from '../lib/prisma';
import { creatUserController, getUsers } from '../controllers/user.controller';
 
const router = Router();
router.get("/users",getUsers);
router.post("/users",creatUserController);
export default router;