import express from "express";
import {
  addReviewController,
  updateReviewController,
  getEventReviewsController,
  deleteReviewController
} from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Add review
router.post("/", authMiddleware, addReviewController);

// Update review
router.put("/", authMiddleware, updateReviewController);

// Get reviews for event
router.get("/:eventId", getEventReviewsController);

// Delete review
router.delete("/:eventId", authMiddleware, deleteReviewController);

export default router;