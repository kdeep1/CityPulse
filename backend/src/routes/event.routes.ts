import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { createEventController, deleteEventController } from "../controllers/event.controller";

const router = Router();

router.post(
  "/events",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
   createEventController 
  
);

router.delete(
  "/events/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  deleteEventController
);

export default router;