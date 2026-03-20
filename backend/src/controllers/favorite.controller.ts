import {Response} from "express";
import {AuthRequest} from "../middlewares/auth.middleware";
import {addFavorite, getUserFavorites, removeFavorite} from "../services/favorite.service";
// Add to favorites
export const addToFavoritesController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const eventId = Number(req.params.eventId);
        const favorite = await addFavorite(userId, eventId);
        res.json({
            message: "Event added to favorites",
            favorite
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};
// Remove from favorites
export const removeFromFavoritesController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const eventId = Number(req.params.eventId);
        const favorite = await removeFavorite(userId, eventId);
        res.json({
            message: "Event removed from favorites",
            favorite
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};
// Get user's favorite events
export const getUserFavoritesController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const favorites = await getUserFavorites(userId);
        res.json({
            message: "User's favorite events",
            favorites
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};