import { Router } from "express";
import {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
  getEventSeatsController
} from "../controllers/event.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { lockSeatsController } from "../controllers/seatLock.controller";

const router = Router();


router.get("/events", getAllEventsController);

router.get("/events/:id", getEventByIdController);

router.get("/events/:id/seats", getEventSeatsController);


router.post(
  "/events",
  authMiddleware,
  roleMiddleware(["ORGANIZER","ADMIN"]),
  createEventController
);


router.patch(
  "/events/:id",
  authMiddleware,
  roleMiddleware(["ORGANIZER","ADMIN"]),
  updateEventController
);


router.delete(
  "/events/:id",
  authMiddleware,
  roleMiddleware(["ADMIN","ORGANIZER"]),
  deleteEventController
);

router.post(
  "/events/:eventId/lock-seats",
  authMiddleware,
  lockSeatsController
);
export default router;