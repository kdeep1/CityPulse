import {Response} from "express";
import {AuthRequest} from "../middlewares/auth.middleware";
import {addReview, updateReview,getEventReviews,deleteReview} from "../services/review.service";
// Add a review
export const addReviewController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { eventId, rating, comment } = req.body;

    if (!eventId || !rating) {
      return res.status(400).json({
        message: "eventId and rating required"
      });
    }

    const review = await addReview(userId, eventId, rating, comment);

    res.json({
      message: "Review added",
      review
    });

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
// Update a review
export const updateReviewController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { eventId, rating, comment } = req.body;

    const review = await updateReview(userId, eventId, rating, comment);

    res.json({
      message: "Review updated",
      review
    });

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
// Get reviews for an event
export const getEventReviewsController = async (req: AuthRequest, res: Response) => {
  try {
    const eventId = Number(req.params.eventId);

    const reviews = await getEventReviews(eventId);

    res.json(reviews);

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
// Delete a review
export const deleteReviewController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const eventId = Number(req.params.eventId);

    await deleteReview(userId, eventId);

    res.json({
      message: "Review deleted"
    });

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};