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

    const result = await createVenueSeats(
      venueId,
      SeatType.VIP||SeatType.REGULAR||SeatType.BALCONY,
        vip || regular || balcony
    );

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