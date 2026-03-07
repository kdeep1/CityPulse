import {Router} from 'express';
import prisma from '../lib/prisma';

const router = Router();
router.get("users",async(req,res)=>{
    const users = await prisma.users.findMany();
    res.json(users);
});
router.post("/users",async(req,res)=>{
    const{username,email,password}= req.body;
    const user = await prisma.users.create({
        data:{
            username,
            email,
            password
        }
    });
    res.json(user);
});
export default router;