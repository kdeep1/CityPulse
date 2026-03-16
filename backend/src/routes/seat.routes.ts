import { Router } from "express";
import { createVenueSeatsController } from "../controllers/seat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.post(
  "/venues/:venueId/seats",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  createVenueSeatsController
);

export default router;