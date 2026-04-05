import { Request, Response } from "express";
import { createVenueSeats } from "../services/seat.service";
import { SeatType } from "@prisma/client";

export const createVenueSeatsController = async (
  req: Request,
  res: Response
) => {

  try {

    const venueId = Number(req.params.venueId);
    const { vip, regular, balcony } = req.body;

    const seatConfigs = [];
    if (vip) seatConfigs.push({ type: SeatType.VIP, count: Number(vip) });
    if (regular) seatConfigs.push({ type: SeatType.REGULAR, count: Number(regular) });
    if (balcony) seatConfigs.push({ type: SeatType.BALCONY, count: Number(balcony) });

    if (seatConfigs.length === 0) {
      return res.status(400).json({ message: "No seat counts provided" });
    }

    const result = await createVenueSeats(venueId, seatConfigs);

    res.json({
      message: "Seats created successfully",
      result
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create seats"
    });

  }
};