import { Request, Response } from "express";
import {
  createVenueService,
  getAllVenuesService,
  getVenueByIdService,
  updateVenueService,
  deleteVenueService
} from "../services/venue.service";
import { log } from "node:console";

export const createVenueController = async (req: Request, res: Response) => {
  try {
    const venue = await createVenueService(req.body);
    res.status(201).json(venue);

  } catch (error) {
    console.error("Error creating venue:", error);
    res.status(500).json({ message: "Failed to create venue" });
  }
};

export const getAllVenuesController = async (req: Request, res: Response) => {
  try {
    const venues = await getAllVenuesService();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch venues" });
  }
};

export const getVenueByIdController = async (req: Request, res: Response) => {
  try {
    const venue = await getVenueByIdService(Number(req.params.id));
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: "Venue not found" });
  }
};

export const updateVenueController = async (req: Request, res: Response) => {
  try {
    const venue = await updateVenueService(Number(req.params.id), req.body);
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: "Failed to update venue" });
  }
};

export const deleteVenueController = async (req: Request, res: Response) => {
  try {
    await deleteVenueService(Number(req.params.id));
    res.json({ message: "Venue deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete venue" });
  }
};