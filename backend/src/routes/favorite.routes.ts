import express from "express";
import { addToFavoritesController, getUserFavoritesController, removeFromFavoritesController } from "../controllers/favorite.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/events/:eventId/favorites", authMiddleware, addToFavoritesController);
router.delete("/events/:eventId/favorites", authMiddleware  , removeFromFavoritesController);
router.get("/favorites", authMiddleware, getUserFavoritesController);

export default router;