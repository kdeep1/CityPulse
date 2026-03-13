import { Request, Response } from "express";
import {
  createEventService,
  getAllEventsService,
  getEventByIdService,
  updateEventService,
  deleteEventService
} from "../services/event.service";
import { AuthRequest } from "../middlewares/auth.middleware";


export const createEventController = async (req: AuthRequest, res: Response) => {

  try {

    const organizerId = req.user.id;

    const event = await createEventService(req.body, organizerId);

    res.status(201).json(event);

  } catch (error) {

    res.status(500).json({
      message: "Failed to create event"
    });

  }

};


export const getAllEventsController = async (req: Request, res: Response) => {

  try {

    const events = await getAllEventsService();

    res.json(events);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch events"
    });

  }

};


export const getEventByIdController = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    const event = await getEventByIdService(id);

    res.json(event);

  } catch (error) {

    res.status(500).json({
      message: "Event not found"
    });

  }

};


export const updateEventController = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    const event = await updateEventService(id, req.body);

    res.json(event);

  } catch (error) {

    res.status(500).json({
      message: "Failed to update event"
    });

  }

};


export const deleteEventController = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id);

    await deleteEventService(id);

    res.json({
      message: "Event deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete event"
    });

  }

};