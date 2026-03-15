import { Router } from "express";
import {
  createVenueController,
  getAllVenuesController,
  getVenueByIdController,
  updateVenueController,
  deleteVenueController
} from "../controllers/venue.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.get("/venues", getAllVenuesController);
router.get("/venues/:id", getVenueByIdController);

router.post(
  "/venues",
  authMiddleware,
  roleMiddleware(["ADMIN","ORGANIZER"]),
  createVenueController
);

router.patch(
  "/venues/:id",
  authMiddleware,
  roleMiddleware(["ADMIN","ORGANIZER"]),
  updateVenueController
);

router.delete(
  "/venues/:id",
  authMiddleware,
  roleMiddleware(["ADMIN","ORGANIZER"]),
  deleteVenueController
);

export default router;