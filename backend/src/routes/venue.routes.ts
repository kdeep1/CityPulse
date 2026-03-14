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
  roleMiddleware(["ADMIN"]),
  createVenueController
);

router.patch(
  "/venues/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateVenueController
);

router.delete(
  "/venues/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  deleteVenueController
);

export default router;