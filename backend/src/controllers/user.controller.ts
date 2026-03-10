import { Request, Response } from "express";
import { getAllUsers, createUser } from "../services/user.services";
import { createUserSchema } from "../validations/user.validation";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const validatedData = createUserSchema.parse(req.body); 
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const creatUserController = async (req: Request, res: Response) => {
    try {
        const validatedData = createUserSchema.parse(req.body); 
        const { username, email, password, firstName, lastName } = validatedData;
        const user = await createUser({ username, email, password, firstName, lastName });
        res.json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "failed to create user" });
    }
};
